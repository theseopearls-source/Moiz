#!/bin/bash

# Start Hospital Management System Backend

echo "Starting Hospital Management System Backend..."

# Start main server
python3 server.py &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Start WhatsApp notification service
python3 whatsapp_service.py &
WHATSAPP_PID=$!

echo "Backend started successfully!"
echo "Server PID: $SERVER_PID"
echo "WhatsApp Service PID: $WHATSAPP_PID"
echo "API running on http://localhost:8000"
echo ""
echo "To stop the backend, run: kill $SERVER_PID $WHATSAPP_PID"

# Wait for both processes
wait
