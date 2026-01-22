---
description: Red Team (Offensive Security) Workflow
---

# Red Team Cybersecurity Workflow

This workflow guides the Red Team agent in simulating attacks to identify vulnerabilities.

## 1. Reconnaissance
- [ ] Analyze application architecture for potential attack vectors.
- [ ] Enumerate endpoints and exposed services.
- [ ] Identify dependencies with known CVEs.

## 2. Vulnerability Scanning
- [ ] Run automated scanners (OWASP ZAP, Nikto) against staging environment.
- [ ] Scan container images for vulnerabilities (Trivy, Grype).

## 3. Exploitation Simulation
- [ ] **Injection Attacks**: Attempt SQLi, NoSQLi, and Command Injection on inputs.
- [ ] **XSS**: Test reflected and stored Cross-Site Scripting capabilities.
- [ ] **Broken Access Control**: Attempt to access admin endpoints as a regular user (IDOR).
- [ ] **File Upload Bypass**: Attempt to upload malicious executables instead of PDFs/Images.

## 4. Reporting
- [ ] Document all findings with Severity scores (CVSS).
- [ ] Provide Proof of Concept (PoC) for critical vulnerabilities.
- [ ] Recommend specific remediation steps.

## 5. Retesting
- [ ] Verify fixes implemented by the development team.
