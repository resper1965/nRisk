package insight

import (
	"fmt"

	"github.com/nrisk/backend/internal/domain"
)

var insightMap = map[string]domain.FindingInsight{
	"open_database_port_mysql": {
		ID:          "open_database_port_mysql",
		Title:       "Banco de Dados MySQL Exposto",
		Description: "Detectamos que a porta 3306 do seu banco de dados está acessível publicamente na internet.",
		Impact:      "Crítico. É equivalente a deixar a porta do cofre da empresa aberta na calçada. Atacantes podem tentar força bruta para acessar seus dados sensíveis.",
		Remediation: "Feche a porta 3306 no seu firewall/Security Group e utilize uma VPN ou SSH Tunnel para acesso administrativo.",
	},
	"open_database_port_postgres": {
		ID:          "open_database_port_postgres",
		Title:       "Banco de Dados PostgreSQL Exposto",
		Description: "A porta 5432 está aberta para a internet.",
		Impact:      "Crítico. Risco altíssimo de exfiltração de dados e ataques de ransomware no banco de dados.",
		Remediation: "Restrinja o acesso à porta 5432 apenas a IPs autorizados ou via rede privada.",
	},
	"self_signed_cert": {
		ID:          "self_signed_cert",
		Title:       "Certificado Self-Signed Detectado",
		Description: "O servidor está usando um certificado SSL assinado por ele mesmo em vez de uma autoridade confiável.",
		Impact:      "Alto. Navegadores exibirão avisos de segurança para os usuários. Indica falta de maturidade em gestão de infraestrutura e facilita ataques Man-in-the-Middle.",
		Remediation: "Substitua o certificado por um emitido por uma CA confiável (ex: Let's Encrypt, DigiCert).",
	},
	"open_rdp_port": {
		ID:          "open_rdp_port",
		Title:       "Acesso Remoto (RDP) Exposto",
		Description: "A porta 3389 (Windows Remote Desktop) está aberta para qualquer IP.",
		Impact:      "Crítico. Porta de entrada número 1 para ataques de Ransomware em ambientes corporativos.",
		Remediation: "Desative o acesso RDP público imediatamente. Use um Gateway de Desktop Remoto ou VPN.",
	},
	"missing_dkim": {
		ID:          "missing_dkim",
		Title:       "Ausência de Assinatura de E-mail (DKIM)",
		Description: "Seus e-mails não estão sendo assinados digitalmente através de DKIM.",
		Impact:      "Médio. Facilita a falsificação (spoofing) de e-mails em nome da sua empresa, aumentando riscos de phishing e prejudicando a entregabilidade.",
		Remediation: "Configure uma chave DKIM no seu provedor de e-mail e adicione o registro TXT correspondente no seu DNS.",
	},
}

// GetInsight returns a FindingInsight for a given technical finding ID
func GetInsight(findingID string) domain.FindingInsight {
	if insight, ok := insightMap[findingID]; ok {
		return insight
	}
	return domain.FindingInsight{
		ID:          findingID,
		Title:       fmt.Sprintf("Achado: %s", findingID),
		Description: "Achado técnico detectado pelo scan automático.",
		Impact:      "O impacto varia de acordo com a criticidade do controle mapeado.",
		Remediation: "Consulte a documentação técnica para passos de correção.",
	}
}
