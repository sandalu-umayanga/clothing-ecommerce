# Tableau Integration Guide

This project integrates Tableau Online for business analytics. It uses **Connected Apps** (Direct Trust) for secure, seamless embedding.

## 1. Tableau Connected App Configuration

1. Log in to your Tableau Cloud/Server.
2. Go to **Settings > Connected Apps**.
3. Create a new **Direct Trust** Connected App.
4. Note down:
   - **Client ID** (App ID)
   - **Secret ID**
   - **Secret Value**

---

## 2. Backend Implementation

The backend generates a JWT that Tableau uses to verify the user's identity and permissions.

### **JWT Claims**
The following claims are required by Tableau:
- `iss`: Client ID
- `sub`: User identity (e.g., email)
- `aud`: "tableau"
- `exp`: Expiration time (max 10 minutes)
- `jti`: Unique token ID
- `scp`: Scopes (e.g., `["tableau:views:embed", "tableau:views:embed_authoring"]`)
- `kid`: Secret ID (in the header)

### **Java Implementation** (`TableauAuthService.java`)
```java
public String generateTableauToken(String username) {
    List<String> scopes = Arrays.asList("tableau:views:embed", "tableau:views:embed_authoring");
    Instant now = Instant.now();
    Key signingKey = Keys.hmacShaKeyFor(secretValue.getBytes(StandardCharsets.UTF_8));

    return Jwts.builder()
            .setHeaderParam("kid", secretId)
            .setHeaderParam("iss", clientId)
            .setIssuer(clientId)
            .setSubject(username)
            .setAudience("tableau")
            .setExpiration(Date.from(now.plus(5, ChronoUnit.MINUTES)))
            .setIssuedAt(Date.from(now))
            .setId(UUID.randomUUID().toString())
            .claim("scp", scopes)
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact();
}
```

---

## 3. Frontend Implementation

The frontend uses the `@tableau/embedding-api-react` library.

### **View Mode**
Displays a read-only interactive dashboard.
```jsx
<TableauViz
  src={TABLEAU_URL}
  token={tableauToken}
  toolbar="hidden"
  hideTabs={true}
  className="w-full h-[800px]"
/>
```

### **Authoring (Edit) Mode**
Allows admins to modify the dashboard directly in the application.
```jsx
<TableauAuthoringViz
  src={TABLEAU_URL}
  token={tableauToken}
  onWorkbookPublished={handleWorkbookPublished}
  className="w-full h-[800px]"
/>
```

---

## 4. Row-Level Security (RLS)
The `User` model contains a `tableauUserId` field. This can be used in Tableau calculations (`USERNAME()`) to filter data so users only see their own information.
