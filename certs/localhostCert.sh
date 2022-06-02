#!/bin/bash

OPENSSL=$(brew --prefix openssl)/bin/openssl
PASSPHRASE=pass:$(security find-generic-password -a $USER -s myCApassphrase -w)

read -r -d '' CSR_CNF <<'EOF'
EOF


# https://www.openssl.org/docs/man1.1.1/man1/openssl-req.html
$OPENSSL req \
  -config <(cat <<< "$CSR_CNF") \
  -newkey rsa:2048 \
  -subj "/CN=localhost" \
  -req \
  -sha256  \
  -keyout localhost.key \
  -passout "$PASSPHRASE" \
  -out localhost.csr \
  -outform PEM

#$OPENSSL req -noout -verify -in localhost.csr -text

read -r -d '' V3_EXT_CNF <<'EOF'
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost 
EOF

$OPENSSL x509 -req -in localhost.csr \
  -CA myCA.pem -CAkey myCA.key -CAcreateserial \
  -sha256 \
  -extfile <(cat <<< "$V3_EXT_CNF") \
  -passin $PASSPHRASE \
  -out localhost.crt || exit 1


echo "Pretty print localhost.crt"
$OPENSSL x509 -in localhost.crt -noout -subject -dates -fingerprint  -ext subjectAltName,keyUsage,basicConstraints,authorityKeyIdentifier
