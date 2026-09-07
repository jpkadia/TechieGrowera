import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import dotenv from 'dotenv';
const base=process.env.ADMIN_AUDIT_URL||'http://localhost:3000';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname),'This credential-bearing smoke test is limited to the local application.');
const login=await fetch(base+'/admin/login');
assert.equal(login.status,200);assert.match(login.headers.get('x-robots-tag')||'',/noindex/);
const html=await login.text();assert.match(html,/<meta name="robots" content="[^"]*noindex/);
const protectedPage=await fetch(base+'/admin',{redirect:'manual'});assert.ok([307,308].includes(protectedPage.status));assert.ok(protectedPage.headers.get('location')?.includes('/admin/login'));
assert.equal((await fetch(base+'/api/admin/leads')).status,401);
assert.equal((await fetch(base+'/api/admin/login',{method:'POST',headers:{origin:'https://untrusted.example','content-type':'application/json','x-admin-request':'1'},body:'{}'})).status,403);
const env=dotenv.parse(await readFile('backend/.env'));
const signedIn=await fetch(base+'/api/admin/login',{method:'POST',headers:{origin:new URL(base).origin,'content-type':'application/json','x-admin-request':'1'},body:JSON.stringify({email:env.ADMIN_EMAIL,password:env.ADMIN_PASSWORD})});
assert.equal(signedIn.status,200,'Configured admin login');
const data=await signedIn.json();assert.equal(data.token,undefined,'Session token must never be in the browser response body');
const setCookie=signedIn.headers.get('set-cookie');assert.ok(setCookie);assert.match(setCookie,/HttpOnly/i);assert.match(setCookie,/SameSite=Strict/i);
const cookie=setCookie.split(';')[0];
try{
 const session=await fetch(base+'/api/admin/session',{headers:{cookie}});assert.equal(session.status,200);assert.match(session.headers.get('cache-control')||'',/no-store/);
 const dashboard=await fetch(base+'/api/admin/dashboard',{headers:{cookie}});assert.equal(dashboard.status,200);
 const crossSite=await fetch(base+'/api/admin/logout',{method:'POST',headers:{cookie,origin:'https://untrusted.example','content-type':'application/json','x-admin-request':'1'},body:'{}'});assert.equal(crossSite.status,403);
}finally{const logout=await fetch(base+'/api/admin/logout',{method:'POST',headers:{cookie,origin:new URL(base).origin,'content-type':'application/json','x-admin-request':'1'},body:'{}'});assert.equal(logout.status,200);}
assert.equal((await fetch(base+'/api/admin/session',{headers:{cookie}})).status,401);
for(const path of ['/blog/nonexistent-admin-audit','/case-studies/nonexistent-admin-audit']){const result=await fetch(base+path,{headers:{'user-agent':'Googlebot'}});assert.equal(result.status,404,`Missing content must return 404: ${path}`);}
console.log('PASS: admin noindex, unauthenticated redirects, HttpOnly/SameSite cookies, CSRF rejection, authenticated API access, logout revocation and missing-content 404s. No credentials or token values logged.');
