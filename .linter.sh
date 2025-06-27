#!/bin/bash
cd /home/kavia/workspace/code-generation/reactcarrace-93938-57e7d378/car_game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

