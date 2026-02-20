#!/bin/bash
# Demo flow: Send connection request, accept it, then chat

API="http://localhost:5000/api"

echo "1. Student sends connection request to alumni..."
curl -X POST "$API/connections" \
  -H "Content-Type: application/json" \
  -H "x-user-id: student-123" \
  -H "x-user-role: student" \
  -d '{"receiverId":"alumni-456"}'

echo -e "\n\n2. Alumni lists received requests..."
curl "$API/connections" \
  -H "x-user-id: alumni-456" \
  -H "x-user-role: alumni"

echo -e "\n\n3. Admin gets system stats..."
curl "$API/admin/stats" \
  -H "x-user-id: admin-1" \
  -H "x-user-role: admin"

echo -e "\n\nDemo flow complete!"
