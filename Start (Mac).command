#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
echo "Starting IntGen Stay Intelligence Engine..."
echo "Opening http://localhost:$PORT in your browser."
echo "Keep this window open while viewing. Close it when finished."
( sleep 1.2; open "http://localhost:$PORT/index.html" ) &
python3 -m http.server $PORT 2>/dev/null || python -m http.server $PORT
