-- =============================================================================
-- n.Risk - TPRA Fase 1: Tabela supplier_invitations
-- Convites de assessment enviados a fornecedores
-- =============================================================================

CREATE TABLE supplier_invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    supplier_id     UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    track           VARCHAR(10) NOT NULL CHECK (track IN ('bronze', 'silver', 'gold')),
    framework_id    UUID NOT NULL REFERENCES frameworks(id),
    invited_email   VARCHAR(255) NOT NULL,
    invited_by      VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'expired')),
    token           VARCHAR(64) NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    accepted_at     TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitations_supplier ON supplier_invitations (supplier_id);
CREATE UNIQUE INDEX idx_invitations_token ON supplier_invitations (token);
CREATE INDEX idx_invitations_tenant_status ON supplier_invitations (tenant_id, status);

-- RLS: tenant so acessa convites que ele criou
ALTER TABLE supplier_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY invitations_tenant_isolation ON supplier_invitations
    USING (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY invitations_tenant_insert ON supplier_invitations
    FOR INSERT
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY invitations_tenant_update ON supplier_invitations
    FOR UPDATE
    USING (tenant_id = current_setting('app.current_tenant_id', true));
