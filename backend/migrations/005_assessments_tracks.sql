-- =============================================================================
-- n.Risk - TPRA Fase 2: Trilhas de Maturidade em Assessments
-- Adiciona track, supplier_id e invitation_id na tabela assessments
-- Adiciona evidence_required e track nas perguntas
-- =============================================================================

-- Novos campos na tabela assessments
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS track VARCHAR(10)
    CHECK (track IS NULL OR track IN ('bronze', 'silver', 'gold'));

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS supplier_id UUID
    REFERENCES suppliers(id) ON DELETE SET NULL;

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS invitation_id UUID
    REFERENCES supplier_invitations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_assessments_supplier ON assessments (supplier_id);
CREATE INDEX IF NOT EXISTS idx_assessments_track ON assessments (tenant_id, track);
