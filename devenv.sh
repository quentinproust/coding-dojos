#!/bin/sh

#tmux new-session -d 'FROM_PARCEL=true ./gradlew bootRun'
#tmux split-window -v './gradlew client:run'

tmux new-session \; \
  send-keys 'FROM_PARCEL=true ./gradlew bootRun' C-m \; \
  split-window -h \; \
  send-keys './gradlew client:run' C-m \;
