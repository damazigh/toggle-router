#!/bin/bash
if ! command -v awslocal &> /dev/null
then
  echo "awslocal is not installed. Please fix this before retrying"
  exit
fi

function create_db() {
  file_path="$(pwd)/script/schema.json"
  echo "trying to import $file_path ..."
  awslocal dynamodb create-table --cli-input-json "file://${file_path}"
}

function delete_db() {
  echo 'delete env table...'
  awslocal dynamodb delete-table --table-name 'ENV'
}

POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--delete)
      delete_db
      shift
      shift
      ;;
    -c|--create)
      create_db
      shift
      shift
      ;;    
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done