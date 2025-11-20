# BLS Signature Aggregation Demo

An interactive demonstration of BLS (Boneh-Lynn-Shacham) signatures and the mathematical properties that enable signature aggregation through bilinear pairings.

## The Mathematics of Bilinearity

### Bilinear Maps

A bilinear pairing is a function `e: G₁ × G₂ → G_T` with the property:

```
e(aP, bQ) = e(P, Q)^(ab)
```

This **bilinearity** property is what makes BLS signatures and their aggregation possible. It allows us to "move" scalar multiplications between the two input groups while preserving the relationship in the target group.

### BLS Signature Scheme

**Key Generation:**
- Secret key: `sk ← random element in F_r`
- Public key: `PK = [sk] · G₁`

**Signing:**
- Hash message to curve: `H(M) → point on G₂`
- Signature: `σ = [sk] · H(M)`

**Verification:**
- Check: `e(G₁, σ) = e(PK, H(M))`

This works because:
```
e(G₁, σ) = e(G₁, [sk]H(M)) = e([sk]G₁, H(M)) = e(PK, H(M))
```

### Signature Aggregation

The key insight: signatures can be aggregated by simple point addition on G₂:

```
σ_agg = σ₁ + σ₂ + σ₃ = [sk₁]H(M) + [sk₂]H(M) + [sk₃]H(M)
```

This equals:
```
σ_agg = [sk₁ + sk₂ + sk₃] · H(M)
```

Verification uses the aggregated public key:
```
e(G₁, σ_agg) = e(PK₁ + PK₂ + PK₃, H(M))
```

**Result:** N signatures (N × 96 bytes) compress to 1 signature (96 bytes), and verification requires only 2 pairings instead of 2N.

### The BLS12-381 Curve

This demo uses BLS12-381, a pairing-friendly curve designed for ~128-bit security [10]. It provides:
- G₁ points: 48 bytes (public keys)
- G₂ points: 96 bytes (signatures)
- Embedding degree k = 12

## Getting Started

```bash
npm install
npm run dev
```

## References

### Foundational Papers

Boneh, D., Lynn, B., & Shacham, H. (2001). "Short signatures from the Weil pairing." *ASIACRYPT 2001*, LNCS 2248, pp. 514-532. https://doi.org/10.1007/3-540-45682-1_30

Miller, V. S. (1986). "The Weil pairing, and its efficient calculation." *Journal of Cryptology*, 17(4), 235-261. https://doi.org/10.1007/s00145-004-0315-8

### Mathematical Background

Galbraith, S. D., Paterson, K. G., & Smart, N. P. (2008). "Pairings for cryptographers." *Discrete Applied Mathematics*, 156(16), 3113-3121. https://doi.org/10.1016/j.dam.2007.12.010

Bowe, S. (2017). "BLS12-381: New zk-SNARK elliptic curve construction." Electric Coin Company Blog. https://electriccoin.co/blog/new-snark-curve/

### Standards & Specifications

Boneh, D., Gorbunov, S., Wahby, R. S., Wee, H., & Zhang, Z. (2020). "BLS signatures." IETF Draft. https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/

Faz-Hernández, A., Scott, S., Sullivan, N., et al. (2023). "Hashing to elliptic curves." RFC 9380. https://datatracker.ietf.org/doc/rfc9380/

### Educational Resources

Buterin, V. (2017). "Exploring elliptic curve pairings." https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627

Menezes, A. (2016). "An introduction to pairing-based cryptography." *Recent Trends in Cryptography*, AMS. https://www.math.uwaterloo.ca/~ajmeneze/publications/pairings.pdf

### Implementation

Miller, P. (2021-2024). "@noble/curves: Audited & minimal JS implementation of elliptic curve cryptography." https://github.com/paulmillr/noble-curves

## License

MIT
