package logger

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

// Entry representa um log estruturado para Cloud Logging.
type Entry struct {
	Timestamp string                 `json:"timestamp"`
	Severity  string                 `json:"severity"`
	Message   string                 `json:"message"`
	Trace     string                 `json:"trace,omitempty"`
	Fields    map[string]interface{} `json:"fields,omitempty"`
}

// Log escreve um log estruturado em JSON no stdout (Cloud Logging ingest).
func Log(severity, message string, fields map[string]interface{}) {
	e := Entry{
		Timestamp: time.Now().UTC().Format(time.RFC3339Nano),
		Severity:  severity,
		Message:   message,
		Fields:    fields,
	}
	if trace := os.Getenv("TRACE_ID"); trace != "" {
		e.Trace = trace
	}
	b, _ := json.Marshal(e)
	fmt.Fprintln(os.Stdout, string(b))
}

func Info(msg string, fields map[string]interface{}) {
	Log("INFO", msg, fields)
}

func Warn(msg string, fields map[string]interface{}) {
	Log("WARNING", msg, fields)
}

func Error(msg string, fields map[string]interface{}) {
	Log("ERROR", msg, fields)
}

func Debug(msg string, fields map[string]interface{}) {
	Log("DEBUG", msg, fields)
}
