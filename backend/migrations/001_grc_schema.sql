-- =============================================================================
-- n.Risk - Esquema GRC (Cloud SQL PostgreSQL)
-- Mapeamento técnico-normativo ISO 27001 e suporte a assessments
-- =============================================================================

-- Extensão para UUID (opcional)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. Tabela tenants
-- id = tenant_id do JWT (Firebase custom claim)
-- =============================================================================
CREATE TABLE tenants (
    id              VARCHAR(100) PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    license_expires_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 2. Tabela frameworks
-- =============================================================================
CREATE TABLE frameworks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    version         VARCHAR(50),
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_frameworks_name_version ON frameworks (name, version);

-- =============================================================================
-- 3. Tabela controls
-- =============================================================================
CREATE TABLE controls (
    id              VARCHAR(20) PRIMARY KEY,
    framework_id    UUID NOT NULL REFERENCES frameworks(id) ON DELETE CASCADE,
    iso_domain      VARCHAR(50) NOT NULL,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_controls_framework ON controls (framework_id);
CREATE INDEX idx_controls_iso_domain ON controls (iso_domain);

-- =============================================================================
-- 4. Tabela mapping_logic
-- Vincula achado técnico (ex: expired_ssl) ao control_id
-- =============================================================================
CREATE TABLE mapping_logic (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id      VARCHAR(20) NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    technical_finding VARCHAR(100) NOT NULL,
    scan_type       VARCHAR(50),
    impact_on_score INT NOT NULL,
    recommendation  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mapping_logic_control ON mapping_logic (control_id);
CREATE INDEX idx_mapping_logic_finding ON mapping_logic (technical_finding);
CREATE UNIQUE INDEX idx_mapping_logic_control_finding ON mapping_logic (control_id, technical_finding);

-- =============================================================================
-- 5. Tabela assessments
-- Respostas dos questionários vinculadas a tenant, control e evidência
-- =============================================================================
CREATE TABLE assessments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    control_id      VARCHAR(20) NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    response_status VARCHAR(10) NOT NULL CHECK (response_status IN ('sim', 'nao', 'na')),
    evidence_url    TEXT,
    responded_by    VARCHAR(255),
    responded_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessments_tenant ON assessments (tenant_id);
CREATE INDEX idx_assessments_control ON assessments (control_id);
CREATE UNIQUE INDEX idx_assessments_tenant_control ON assessments (tenant_id, control_id);

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- Isolamento por tenant_id em todas as tabelas que o contêm
-- =============================================================================

-- Assessments: tenant só acessa seus próprios registros
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY assessments_tenant_isolation ON assessments
    USING (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY assessments_tenant_insert ON assessments
    FOR INSERT
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY assessments_tenant_update ON assessments
    FOR UPDATE
    USING (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY assessments_tenant_delete ON assessments
    FOR DELETE
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Nota: tenants, frameworks, controls e mapping_logic não têm tenant_id
-- e são dados globais (catálogo). Apenas assessments é multi-tenant.
-- Se houver outras tabelas com tenant_id no futuro, aplicar RLS similar.

-- =============================================================================
-- 7. Função para definir tenant na sessão (chamada pelo backend antes das queries)
-- =============================================================================
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', COALESCE(tenant_id, ''), false);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 8. Dados iniciais (exemplo ISO 27001)
-- =============================================================================
INSERT INTO frameworks (id, name, version, description) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'ISO 27001', '2022', 'Controles do Anexo A da ISO/IEC 27001:2022')
ON CONFLICT (id) DO NOTHING;

INSERT INTO controls (id, framework_id, iso_domain, title, description) VALUES
    ('C-01', 'a0000000-0000-0000-0000-000000000001', 'A.13.1.1', 'Controle de portas críticas', 'Redes - Políticas de controle de acesso a serviços'),
    ('C-02', 'a0000000-0000-0000-0000-000000000001', 'A.10.1.1', 'Gestão de certificados', 'Criptografia - Certificados digitais'),
    ('C-03', 'a0000000-0000-0000-0000-000000000001', 'A.12.6.1', 'Patch management', 'Segurança operacional - Gestão de vulnerabilidades'),
    ('C-04', 'a0000000-0000-0000-0000-000000000001', 'A.13.2.1', 'Proteção anti-phishing', 'Comunicações - DMARC/SPF')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mapping_logic (control_id, technical_finding, scan_type, impact_on_score, recommendation) VALUES
    ('C-01', 'open_rdp_port', 'port_scan', 500, 'Restringir porta 3389 ou usar VPN'),
    ('C-01', 'open_smb_port', 'port_scan', 500, 'Bloquear porta 445 para internet'),
    ('C-02', 'expired_ssl', 'ssl_check', 200, 'Renovar certificado SSL'),
    ('C-02', 'ssl_expires_soon', 'ssl_check', 100, 'Planejar renovação do certificado'),
    ('C-03', 'outdated_software', 'version_check', 80, 'Aplicar patches de segurança'),
    ('C-04', 'missing_dmarc', 'dns_check', 200, 'Implementar DMARC com política p=reject'),
    ('C-04', 'dmarc_none', 'dns_check', 150, 'Alterar DMARC para p=quarantine ou p=reject')
ON CONFLICT (control_id, technical_finding) DO NOTHING;
