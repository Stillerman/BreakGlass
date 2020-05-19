# BreakGlass

Temporary GCP Privilege Escalation Tool

## What is this?

BreakGlass is a tool that allows developers to temporarily escalate their own GCP permissions at any time. This is like the sudo command for GCP permissions. Developers will be able to fix things at 3 AM without waking up the teams RP.

## How it works

1. Sign into the app with your GCP credentials
2. Select a client
3. Select a project
4. Select the permissions you need
5. Select a timeframe
6. Provide your reasoning for breaking the glass
7. Your permissions will be provided and the event will be logged

# Getting Started (This needs some work)

1. Create a service account
2. Give it the following permissions (Need to find out what permissions go here)
3. Create .env (Is not effective yet)
4. yarn k8s
5. Done.
