cURL command: curl -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d "{\"username\":\"student123\",\"password\":\"password123\"}"

Output:
{"message":"User successfully logged in","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0dWRlbnQxMjMiLCJkYXRhIjoic3R1ZGVudDEyMyIsImlhdCI6MTc5MTAwNzk2OCwiZXhwIjoxNzkxMDExNTY4fQ.vqb4aXhS9Eo4-1ap326tJkMyeX3koVB57o-HQa_3YeA"}
