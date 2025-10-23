#!/bin/bash
echo "1. Health check:"
curl http://localhost:3000/health
echo -e "\n\n2. Ping (x2):"
curl http://localhost:3000/ping
curl http://localhost:3000/ping
echo -e "\n\n3. List responses:"
curl -H "Authorization: Bearer eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYWRtaW4ifQ." http://localhost:3000/responses
echo -e "\n\n4. Clear responses:"
curl -X DELETE -H "Authorization: Bearer eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYWRtaW4ifQ." http://localhost:3000/responses