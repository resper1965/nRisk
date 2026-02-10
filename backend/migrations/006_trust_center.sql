-- Migration 006: Trust Center e NDA Workflow (TPRA Fase 4)
-- Trust Center permite que o avaliado publique score, selos e docs
-- NDA controla acesso a documentos sensiveis

CREATE TABLE IF NOT EXISTS trust_center_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),

    -- Configuracoes de visibilidade
    show_score BOOLEAN NOT NULL DEFAULT false,
    show_spider_chart BOOLEAN NOT NULL DEFAULT false,
    show_grade BOOLEAN NOT NULL DEFAULT true,
    require_nda BOOLEAN NOT NULL DEFAULT false,
    nda_expiry_days INTEGER NOT NULL DEFAULT 90,

    -- Selos/badges (JSON array)
    badges JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Documentos publicos (JSON array)
    public_documents JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Documentos protegidos por NDA (JSON array)
    nda_documents JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Contato
    contact_email VARCHAR(255),
    privacy_policy_url VARCHAR(500),
    terms_url VARCHAR(500),

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trust_center_tenant ON trust_center_profiles(tenant_id);
CREATE UNIQUE INDEX idx_trust_center_slug ON trust_center_profiles(slug);

-- NDA Requests
CREATE TABLE IF NOT EXISTS nda_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    trust_center_id UUID NOT NULL REFERENCES trust_center_profiles(id) ON DELETE CASCADE,
    requester_name VARCHAR(255) NOT NULL,
    requester_email VARCHAR(255) NOT NULL,
    requester_company VARCHAR(255) NOT NULL,
    requester_role VARCHAR(100),
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    decision_note TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_nda_requests_tenant ON nda_requests(tenant_id);
CREATE INDEX idx_nda_requests_trust_center ON nda_requests(trust_center_id);
CREATE INDEX idx_nda_requests_status ON nda_requests(tenant_id, status);
CREATE INDEX idx_nda_requests_email ON nda_requests(requester_email);

-- RLS
ALTER TABLE trust_center_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY trust_center_tenant_isolation ON trust_center_profiles
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY nda_requests_tenant_isolation ON nda_requests
    USING (tenant_id = current_setting('app.current_tenant')::uuid);
