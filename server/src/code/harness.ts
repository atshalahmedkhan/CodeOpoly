import type { Challenge, ChallengeTest, Language, ValueType } from './problems.js';

const json = (v: unknown) => JSON.stringify(v);
function cppLiteral(v: unknown, t: ValueType): string {
  if (t === 'string' || t === 'char') return json(v);
  if (t === 'boolean') return v ? 'true' : 'false';
  if (t.endsWith('[]')) {
    const inner = t.slice(0, -2) as ValueType;
    return `{${(v as unknown[]).map(x => cppLiteral(x, inner)).join(',')}}`;
  }
  return String(v);
}
function javaLiteral(v: unknown, t: ValueType): string {
  if (t === 'string' || t === 'char') return json(v);
  if (t === 'boolean') return v ? 'true' : 'false';
  if (t.endsWith('[]')) {
    const inner = t.slice(0, -2) as ValueType;
    const base = inner === 'int' ? 'int' : inner === 'number' ? 'double' : inner === 'string' || inner === 'char' ? 'String' : inner === 'int[]' ? 'int[]' : 'String[]';
    return `new ${base}[]{${(v as unknown[]).map(x => javaLiteral(x, inner)).join(',')}}`;
  }
  return String(v);
}

const cppSerializer = `
string j(string s){string o="\\\"";for(char c:s){if(c=='\\\"'||c=='\\\\')o+='\\\\';o+=c;}return o+"\\\"";}
string j(const char*s){return j(string(s));} string j(bool v){return v?"true":"false";}
template<class T> typename enable_if<is_arithmetic<T>::value,string>::type j(T v){ostringstream o;o<<v;return o.str();}
template<class T> string j(const vector<T>&v){string o="[";for(size_t i=0;i<v.size();i++){if(i)o+=",";o+=j(v[i]);}return o+"]";}`;
const javaSerializer = `
static String j(String s){return "\\\""+s.replace("\\\\","\\\\\\\\").replace("\\\"","\\\\\\\"")+"\\\"";}
static String j(boolean v){return String.valueOf(v);} static String j(int v){return String.valueOf(v);} static String j(double v){return String.valueOf(v);}
static String j(int[] a){return Arrays.toString(a).replace(" ","");} static String j(String[] a){StringJoiner x=new StringJoiner(",","[","]");for(String v:a)x.add(j(v));return x.toString();}
static String j(int[][] a){StringJoiner x=new StringJoiner(",","[","]");for(int[] v:a)x.add(j(v));return x.toString();} static String j(String[][] a){StringJoiner x=new StringJoiner(",","[","]");for(String[] v:a)x.add(j(v));return x.toString();}`;

export function buildHarness(challenge: Challenge, test: ChallengeTest, language: Language, source: string): string {
  const args = test.input;
  if (language === 'javascript') return `${source}\nconst __r=${challenge.functionName}(...${json(args)});\nconsole.log(JSON.stringify(__r));`;
  if (language === 'python') return `import json\n${source}\n__args=json.loads(${json(json(args))})\nprint(json.dumps(${challenge.functionName}(*__args),separators=(',',':')))`;
  if (language === 'cpp') {
    const call = args.map((v,i)=>cppLiteral(v, challenge.argTypes[i])).join(',');
    return `#include <bits/stdc++.h>\nusing namespace std;\n${source}\n${cppSerializer}\nint main(){auto r=${challenge.functionName}(${call});cout<<j(r);}`;
  }
  const call = args.map((v,i)=>javaLiteral(v, challenge.argTypes[i])).join(',');
  return `import java.util.*;\npublic class Main {\n${source}\n${javaSerializer}\npublic static void main(String[] z){var r=${challenge.functionName}(${call});System.out.print(j(r));}\n}`;
}

