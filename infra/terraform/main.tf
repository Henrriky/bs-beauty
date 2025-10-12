provider "aws" {
  region = "sa-east-1"
}

resource "aws_vpc" "bsbeauty_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "bsbeauty-vpc"
  }
}

# Subnets

resource "aws_subnet" "public" {
  vpc_id = aws_vpc.bsbeauty_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = var.availability_zone
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  vpc_id = aws_vpc.bsbeauty_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = var.availability_zone
}

# Internet Gateway

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.bsbeauty_vpc.id
  tags = {
    Name = "bsbeauty-igw"
  }
}

# NAT Gateway

resource "aws_eip" "nat" {
  tags = {
    Name = "bsbeauty-eip"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id = aws_subnet.public.id
  connectivity_type = "public"
  tags = {
    Name = "bsbeauty-nat"
  }
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.bsbeauty_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "bsbeauty-public-rt"
  }
}

resource "aws_route_table_association" "public_association" {
  route_table_id = aws_route_table.public.id
  subnet_id = aws_subnet.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.bsbeauty_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
  tags = {
    Name = "bsbeauty-public-rt"
  }
}

resource "aws_route_table_association" "private_association" {
  route_table_id = aws_route_table.private.id
  subnet_id = aws_subnet.private.id
}

# Security Group

resource "aws_security_group" "public" { 

  name = "bsbeauty-public-sg"
  description = "Permite SSH HTTP HTTPS publicos"
  vpc_id = aws_vpc.bsbeauty_vpc.id

  ingress {
    description = "SSH"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Internet"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bsbeauty-public-sg"
  }
}

resource "aws_security_group" "private" { 

  name = "bsbeauty-private-sg"
  description = "Permite acesso apenas da instancia publica"
  vpc_id = aws_vpc.bsbeauty_vpc.id

  ingress {
    description = "SSH"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    security_groups = [aws_security_group.public.id]
  }

  ingress {
    description = "HTTP"
    from_port = 3000
    to_port = 3000
    protocol = "tcp"
    security_groups = [aws_security_group.public.id]
  }

  egress {
    description = "Internet"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bsbeauty-private-sg"
  }
}

# AMI

data "aws_ami" "ubuntu" {
  most_recent = true
  owners = ["099720109477"] # Canonical

  filter {
    name = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

# Instâncias

resource "aws_instance" "public" {
  ami = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name = var.ssh_key_pair_name

  subnet_id = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.public.id]

  root_block_device {
    delete_on_termination = true
    volume_size = 10
    volume_type = "gp3"
  }

  tags = {
    Name = "bsbeauty-public-ec2"
  }
}

resource "aws_instance" "private" {
  ami = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name = var.ssh_key_pair_name

  subnet_id = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.private.id]

  root_block_device {
    delete_on_termination = true
    volume_size = 25
    volume_type = "gp3"
  }

  tags = {
    Name = "bsbeauty-private-ec2"
  }
}