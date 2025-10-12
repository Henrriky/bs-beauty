variable "availability_zone" {
  description = "ID of Availability Zone"
  type = string
  default = "sa-east-1a"
}

variable "ssh_key_pair_name" {
  description = "Name of SSH Keypair to Attach into Instances"
  type = string
  default = "bsbeauty-ssh-key"
}