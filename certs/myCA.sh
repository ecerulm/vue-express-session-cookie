#!/bin/bash
# brew install openssl
# security add-generic-password -a $USER -s myCApassphrase -w SOMESECRETPASSPHRASE
# security add-generic-password -a $USER -s myCApassphrase -w $(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9$./,:' | fold -w 32| head -n 1)

# set -euxo pipefail 

# https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/
# https://www.ibm.com/docs/en/ztpf/1.1.0.15?topic=gssccr-configuration-file-generating-self-signed-certificates-certificate-requests
# https://www.golinuxcloud.com/add-x509-extensions-to-certificate-openssl/

read -r -d '' MY_CA_CNF <<'EOF'
[ v3_ca ]
basicConstraints = critical,CA:TRUE
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer
keyUsage=critical,keyCertSign,cRLSign
EOF


OPENSSL=$(brew --prefix openssl)/bin/openssl 

echo "Get passphrase for CA key from KeyChain" 
PASSPHRASE=$(security find-generic-password -a $USER -s myCApassphrase -w)
if [ -z "${PASSPHRASE-}" ]; then 
	echo "Couldn't find a passphrase for CA in the Keychain. Create one with"
  echo 'security add-generic-password -a $USER -s myCApassphrase -w $(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9$./,:' | fold -w 32| head -n 1)' 
	exit 1
fi
PASSPHRASE="pass:${PASSPHRASE}" 

echo "Generate key for CA" 
$OPENSSL genrsa -des3 -out myCA.key -passout "$PASSPHRASE" 2048  || exit 1

echo "Generate myCA.pem (CA certificate for signing)" 

$OPENSSL x509 \
  -new \
  -subj "/C=US/ST=LocalDev/L=LocalDev/O=LocalDev/CN=LocalDev" \
  -key myCA.key \
  -passin "$PASSPHRASE" \
  -extfile <(cat <<< "$MY_CA_CNF") \
  -extensions v3_ca \
  -outform PEM \
  -out myCA.pem || exit 1


echo "myCA.pem pretty print contents:" 
$OPENSSL x509 -in myCA.pem -noout -subject -issuer -dates -ext basicConstraints,subjectKeyIdentifier,authorityKeyIdentifier,keyUsage

echo "Add the LocalDev CA to the default keychain"
security add-trusted-cert -k $(security default-keychain|xargs) myCA.pem
