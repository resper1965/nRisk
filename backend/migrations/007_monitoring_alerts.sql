-- Migration 007: Monitoramento Continuo e Alertas (TPRA Fase 6)
-- Config de re-scan por criticidade e sistema de alertas de deterioracao

CREATE TABLE IF NOT EXISTS monitoring_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,

    -- Frequencia de re-scan por criticidade (dias)
    critical_interval_days INTEGER NOT NULL DEFAULT 7,
    high_interval_days INTEGER NOT NULL DEFAULT 14,
    medium_interval_days INTEGER NOT NULL DEFAULT 30,
    low_interval_days INTEGER NOT NULL DEFAULT 90,

    -- Thresholds de alerta
    score_drop_threshold INTEGER NOT NULL DEFAULT 100,
    category_change_alert BOOLEAN NOT NULL DEFAULT true,

    -- Webhook
    webhook_url VARCHAR(500),
    webhook_enabled BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_monitoring_config_tenant ON monitoring_config(tenant_id);

-- Alertas
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,

    type VARCHAR(30) NOT NULL CHECK (type IN ('score_drop', 'category_change', 'critical_finding', 'scan_overdue')),
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    title VARCHAR(500) NOT NULL,
    detail TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),

    metadata JSONB,

    acknowledged_at TIMESTAMPTZ,
    acknowledged_by VARCHAR(255),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_tenant ON alerts(tenant_id);
CREATE INDEX idx_alerts_tenant_status ON alerts(tenant_id, status);
CREATE INDEX idx_alerts_supplier ON alerts(supplier_id);
CREATE INDEX idx_alerts_created ON alerts(tenant_id, created_at DESC);

-- RLS
ALTER TABLE monitoring_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY monitoring_config_tenant_isolation ON monitoring_config
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY alerts_tenant_isolation ON alerts
    USING (tenant_id = current_setting('app.current_tenant')::uuid);
