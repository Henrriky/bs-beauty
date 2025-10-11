terraform {

  cloud {
    organization = "IFSP"

    workspaces {
      project = "bsbeauty"
      name = "bsbeauty"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
  }

  required_version = ">= 1.2"
}