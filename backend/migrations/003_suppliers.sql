-- =============================================================================
-- n.Risk - TPRA Fase 1: Tabela suppliers
-- Cadastro de fornecedores avaliados pelo tenant (Gestor GRC)
-- =============================================================================

CREATE TABLE suppliers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    domain          VARCHAR(253) NOT NULL,
    cnpj            VARCHAR(18),
    criticality     VARCHAR(10) NOT NULL CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
    category        VARCHAR(100),
    status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_assessment', 'blocked')),
    supplier_tenant_id VARCHAR(100) REFERENCES tenants(id),
    contact_name    VARCHAR(255),
    contact_email   VARCHAR(255),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_suppliers_tenant ON suppliers (tenant_id);
CREATE INDEX idx_suppliers_domain ON suppliers (domain);
CREATE INDEX idx_suppliers_tenant_criticality ON suppliers (tenant_id, criticality);
CREATE INDEX idx_suppliers_tenant_status ON suppliers (tenant_id, status);

-- RLS: tenant so acessa seus proprios fornecedores
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY suppliers_tenant_isolation ON suppliers
    USING (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY suppliers_tenant_insert ON suppliers
    FOR INSERT
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY suppliers_tenant_update ON suppliers
    FOR UPDATE
    USING (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY suppliers_tenant_delete ON suppliers
    FOR DELETE
    USING (tenant_id = current_setting('app.current_tenant_id', true));
