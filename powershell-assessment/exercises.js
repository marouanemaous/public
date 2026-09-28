/* PowerShell Practical Assessment: public exercise content and the
   submission-code format. Contains no answers, solutions or scoring rules;
   those live only in the private answer key loaded by the results vault. */
(function () {
'use strict';

const TOTAL_SECONDS = 30 * 60;

const Q = [
  {
    "id": "q1",
    "title": "Pipeline filtering and sorting",
    "short": "Filter & sort",
    "points": 15,
    "minutes": 4,
    "level": "Intermediate",
    "statement": "\n    <p>A monitoring job exported the services below. Operations wants a list of services that are <b>configured to start automatically but are not currently running</b>.</p>\n    <ul>\n      <li>Keep only services whose <code>StartType</code> is <code>Automatic</code> and whose <code>Status</code> is anything other than <code>Running</code>.</li>\n      <li>Sort by <code>DependentCount</code> <b>descending</b>, then by <code>Name</code> <b>ascending</b>.</li>\n      <li>Output only <code>Name</code>, <code>Status</code> and <code>DependentCount</code>, as objects (not formatted text).</li>\n    </ul>",
    "input": "$services = @(\n    [pscustomobject]@{ Name = 'Spooler';  Status = 'Running';     StartType = 'Automatic'; DependentCount = 2 }\n    [pscustomobject]@{ Name = 'wuauserv'; Status = 'Stopped';     StartType = 'Manual';    DependentCount = 0 }\n    [pscustomobject]@{ Name = 'W32Time';  Status = 'Stopped';     StartType = 'Automatic'; DependentCount = 1 }\n    [pscustomobject]@{ Name = 'BITS';     Status = 'StopPending'; StartType = 'Automatic'; DependentCount = 0 }\n    [pscustomobject]@{ Name = 'Dnscache'; Status = 'Running';     StartType = 'Automatic'; DependentCount = 5 }\n    [pscustomobject]@{ Name = 'AppIDSvc'; Status = 'Stopped';     StartType = 'Automatic'; DependentCount = 3 }\n    [pscustomobject]@{ Name = 'Fax';      Status = 'Stopped';     StartType = 'Disabled';  DependentCount = 0 }\n    [pscustomobject]@{ Name = 'WinRM';    Status = 'Stopped';     StartType = 'Automatic'; DependentCount = 0 }\n)",
    "output": "Name     Status      DependentCount\n----     ------      --------------\nAppIDSvc Stopped                  3\nW32Time  Stopped                  1\nBITS     StopPending              0\nWinRM    Stopped                  0",
    "outputIsHtml": false,
    "starter": "# $services is already defined as shown in \"Sample input\".\n# Write a single pipeline that produces the expected output.\n\n",
    "checkpoint": {
      "points": 4,
      "text": "A colleague writes <code>... | Sort-Object DependentCount, Name -Descending</code> instead. Which service ends up on the <b>third</b> row of their output?",
      "options": [
        "BITS",
        "WinRM",
        "W32Time",
        "The output is identical to the expected output"
      ]
    }
  },
  {
    "id": "q2",
    "title": "Objects and calculated properties",
    "short": "Calculated properties",
    "points": 15,
    "minutes": 5,
    "level": "Intermediate",
    "statement": "\n    <p>A disk inventory returns raw byte counts. Build a capacity report with <code>Select-Object</code> and <b>calculated properties</b>.</p>\n    <ul>\n      <li><code>Server</code>: the value of <code>ComputerName</code> (renamed).</li>\n      <li><code>Drive</code>: unchanged.</li>\n      <li><code>SizeGB</code>: size in GB (1 GB = 1024³ bytes), rounded to 1 decimal.</li>\n      <li><code>FreePct</code>: free space as a percentage of size, rounded to a whole number. It must stay <b>numeric</b>.</li>\n      <li><code>Status</code>: <code>Critical</code> below 10% free, <code>Warning</code> below 20%, otherwise <code>OK</code>.</li>\n      <li>Sort by <code>FreePct</code> ascending.</li>\n    </ul>",
    "input": "$volumes = @(\n    [pscustomobject]@{ ComputerName = 'SRV-APP01'; Drive = 'C:'; SizeBytes = 128032975094;  FreeBytes = 10211284746 }\n    [pscustomobject]@{ ComputerName = 'SRV-APP01'; Drive = 'D:'; SizeBytes = 536731325563;  FreeBytes = 162156490260 }\n    [pscustomobject]@{ ComputerName = 'SRV-DB01';  Drive = 'C:'; SizeBytes = 135967927173;  FreeBytes = 20873541059 }\n    [pscustomobject]@{ ComputerName = 'SRV-DB01';  Drive = 'E:'; SizeBytes = 2198915881370; FreeBytes = 204365281362 }\n    [pscustomobject]@{ ComputerName = 'SRV-WEB01'; Drive = 'C:'; SizeBytes = 85319525335;   FreeBytes = 16192026706 }\n)",
    "output": "Server    Drive SizeGB FreePct Status\n------    ----- ------ ------- ------\nSRV-APP01 C:     119.2       8 Critical\nSRV-DB01  E:    2047.9       9 Critical\nSRV-DB01  C:     126.6      15 Warning\nSRV-WEB01 C:      79.5      19 Warning\nSRV-APP01 D:     499.9      30 OK",
    "outputIsHtml": false,
    "starter": "# $volumes is already defined as shown in \"Sample input\".\n# Use Select-Object with calculated properties.\n\n",
    "checkpoint": {
      "points": 4,
      "text": "Someone computes FreePct as <code>'{0:N0}' -f ($_.FreeBytes / $_.SizeBytes * 100)</code> and then sorts by FreePct. In what order do the FreePct values come out?",
      "options": [
        "8, 9, 15, 19, 30",
        "15, 19, 30, 8, 9",
        "30, 19, 15, 9, 8",
        "Sort-Object throws because the values are strings"
      ]
    }
  },
  {
    "id": "q3",
    "title": "Functions and parameters",
    "short": "Advanced function",
    "points": 20,
    "minutes": 6,
    "level": "Intermediate+",
    "statement": "\n    <p>Write an advanced function <code>Get-StaleAccount</code> that finds inactive user accounts from objects sent through the pipeline.</p>\n    <ul>\n      <li>Accepts user objects from the <b>pipeline</b> (properties: <code>SamAccountName</code>, <code>LastLogonDate</code> as <code>[datetime]</code> or <code>$null</code>, <code>Enabled</code> as <code>[bool]</code>).</li>\n      <li><code>-InactiveDays</code>: <code>[int]</code>, default <b>90</b>, must be validated to the range <b>1–3650</b>.</li>\n      <li><code>-ReferenceDate</code>: <code>[datetime]</code>, defaults to the current date.</li>\n      <li><code>-IncludeDisabled</code>: a switch. Disabled accounts are skipped unless it is present.</li>\n      <li>An account is stale when it has <b>never logged on</b> (<code>LastLogonDate</code> is <code>$null</code>) or its whole days since last logon are <b>greater than</b> <code>InactiveDays</code>.</li>\n      <li>Emit one <code>[pscustomobject]</code> per stale account with <code>SamAccountName</code>, <code>DaysInactive</code> (<code>[int]</code>, or <code>$null</code> when never logged on) and <code>Reason</code> (<code>NeverLoggedOn</code> or <code>Inactive</code>). No <code>Write-Host</code>, no <code>Format-*</code>.</li>\n    </ul>",
    "input": "$ref = [datetime]'2026-03-01'\n$users = @(\n    [pscustomobject]@{ SamAccountName = 'jdoe';    LastLogonDate = [datetime]'2026-02-20'; Enabled = $true  }\n    [pscustomobject]@{ SamAccountName = 'asmith';  LastLogonDate = [datetime]'2025-10-15'; Enabled = $true  }\n    [pscustomobject]@{ SamAccountName = 'svc_bkp'; LastLogonDate = $null;                  Enabled = $true  }\n    [pscustomobject]@{ SamAccountName = 'old_tmp'; LastLogonDate = [datetime]'2024-06-01'; Enabled = $false }\n)\n\n$users | Get-StaleAccount -ReferenceDate $ref\n$users | Get-StaleAccount -ReferenceDate $ref -InactiveDays 400 -IncludeDisabled",
    "output": "<span class=\"ps\">PS> $users | Get-StaleAccount -ReferenceDate $ref</span>\n\nSamAccountName DaysInactive Reason\n-------------- ------------ ------\nasmith                  137 Inactive\nsvc_bkp                     NeverLoggedOn\n\n<span class=\"ps\">PS> $users | Get-StaleAccount -ReferenceDate $ref -InactiveDays 400 -IncludeDisabled</span>\n\nSamAccountName DaysInactive Reason\n-------------- ------------ ------\nsvc_bkp                     NeverLoggedOn\nold_tmp                 638 Inactive",
    "outputIsHtml": true,
    "starter": "function Get-StaleAccount {\n    # Write your advanced function here.\n\n}\n",
    "checkpoint": {
      "points": 4,
      "text": "A candidate declares the pipeline parameter correctly but writes all the logic directly in the function body, with <b>no</b> <code>begin</code>/<code>process</code>/<code>end</code> blocks. What does <code>$users | Get-StaleAccount -ReferenceDate $ref</code> return?",
      "options": [
        "All stale accounts (asmith, svc_bkp), same as the expected output",
        "Only the first piped user is evaluated: jdoe, not stale, so nothing is returned",
        "Only the last piped user is evaluated: old_tmp, which is disabled, so nothing is returned",
        "A parameter binding error for the second pipeline object"
      ]
    }
  },
  {
    "id": "q4",
    "title": "Error handling",
    "short": "Error handling",
    "points": 20,
    "minutes": 6,
    "level": "Intermediate+",
    "statement": "\n    <p>The script in the editor is meant to count lines in several log files and record failures, but the <code>catch</code> block never runs. Fix it.</p>\n    <p>Assume <code>app.log</code> exists and has 120 lines, <code>missing.log</code> does not exist, and <code>locked.log</code> is locked by another process. <code>Get-Content</code> reports both failures as <b>non-terminating</b> errors by default.</p>\n    <ul>\n      <li>Every failure must be caught and recorded in <code>Reason</code>; processing must continue with the next file.</li>\n      <li>A missing file gets <code>Reason = 'NotFound'</code> (catch it by exception type: <code>ItemNotFoundException</code>). Any other failure gets <code>Reason = 'ReadError'</code>.</li>\n      <li><code>$attempted</code> must be incremented in a <code>finally</code> block.</li>\n      <li>Replace <code>Write-Host</code> with something that does not bypass the output streams.</li>\n    </ul>",
    "input": "# Files (you cannot run this; reason about the behavior):\n#   C:\\Logs\\app.log      exists, 120 lines\n#   C:\\Logs\\missing.log  does not exist\n#   C:\\Logs\\locked.log   exists, locked by another process (IOException)",
    "output": "Path                Lines Reason\n----                ----- ------\nC:\\Logs\\app.log       120\nC:\\Logs\\missing.log     0 NotFound\nC:\\Logs\\locked.log      0 ReadError\nAttempted: 3",
    "outputIsHtml": false,
    "starter": "$paths     = @('C:\\Logs\\app.log', 'C:\\Logs\\missing.log', 'C:\\Logs\\locked.log')\n$attempted = 0\n$results   = @()\n\nforeach ($p in $paths) {\n    try {\n        $content  = Get-Content -Path $p\n        $results += [pscustomobject]@{ Path = $p; Lines = $content.Count; Reason = $null }\n    }\n    catch {\n        $results += [pscustomobject]@{ Path = $p; Lines = 0; Reason = $_.Exception.Message }\n    }\n    $attempted++\n}\n\nWrite-Host \"Done\"\n$results\n\"Attempted: $attempted\"\n",
    "checkpoint": {
      "points": 4,
      "text": "In the <b>original</b> script (as given), what is recorded in <code>$results</code> for <code>missing.log</code>?",
      "options": [
        "Lines = 0 and Reason = the \"Cannot find path\" message, because the catch block runs",
        "Lines = 0 and Reason = $null. The catch block never runs; the error only goes to the error stream",
        "Nothing: the script stops at missing.log and app.log is the only result",
        "Lines = 1 and Reason = $null, because $null.Count is 1"
      ]
    }
  },
  {
    "id": "q5",
    "title": "Practical automation: server compliance report",
    "short": "Compliance report",
    "points": 30,
    "minutes": 9,
    "level": "Advanced",
    "statement": "\n    <p>Build a compliance report from the CSV inventory below. Use <code>[datetime]'2026-03-01'</code> as today. Every CSV field arrives as a <b>string</b>.</p>\n    <p>Check each server against these rules, in this order. Each rule that applies adds its label to the server's issues:</p>\n    <ul>\n      <li><code>Unpatched</code>: days since <code>LastPatchDate</code> is greater than <b>60</b> for <code>Prod</code>, or greater than <b>90</b> for any other environment.</li>\n      <li><code>HighCpu</code>: <code>CpuPct</code> is greater than <b>85</b>.</li>\n      <li><code>UnsupportedOS</code>: the OS is any Windows Server <b>2012</b> edition.</li>\n      <li><code>NoOwner</code>: <code>Owner</code> is empty.</li>\n      <li><code>Legacy</code>: the semicolon-separated <code>Tags</code> field contains the tag <code>legacy</code>.</li>\n    </ul>\n    <p>Output only servers with at least one issue, with these properties: <code>Name</code>, <code>Environment</code>, <code>Owner</code> (<code>UNASSIGNED</code> when empty), <code>DaysSincePatch</code> (<code>[int]</code>) and <code>Issues</code> (labels joined with <code>\", \"</code>). Sort by <b>number of issues descending</b>, then <code>Name</code> ascending.</p>",
    "input": "$today = [datetime]'2026-03-01'\n$csv = @'\nName,Environment,OS,LastPatchDate,Owner,CpuPct,Tags\nSRV-WEB01,Prod,Windows Server 2019,2026-01-10,alice,72,web;public\nSRV-WEB02,Prod,Windows Server 2022,2026-02-25,alice,91,web;public\nSRV-DB01,Prod,Windows Server 2016,2025-11-02,bob,45,sql\nSRV-DB02,Test,Windows Server 2016,2025-08-19,bob,12,sql\nSRV-APP01,Prod,Windows Server 2022,2026-02-27,,88,app\nSRV-APP02,Dev,Windows Server 2019,2025-12-01,carol,95,app;legacy\nSRV-FS01,Prod,Windows Server 2012 R2,2025-06-30,dave,30,files;legacy\nSRV-TST01,Test,Windows Server 2022,2026-02-20,carol,9,\n'@",
    "output": "Name      Environment Owner      DaysSincePatch Issues\n----      ----------- -----      -------------- ------\nSRV-FS01  Prod        dave                  244 Unpatched, UnsupportedOS, Legacy\nSRV-APP01 Prod        UNASSIGNED              2 HighCpu, NoOwner\nSRV-APP02 Dev         carol                  90 HighCpu, Legacy\nSRV-DB01  Prod        bob                   119 Unpatched\nSRV-DB02  Test        bob                   194 Unpatched\nSRV-WEB02 Prod        alice                   4 HighCpu",
    "outputIsHtml": false,
    "starter": "# $today and $csv are already defined as shown in \"Sample input\".\n\n",
    "checkpoint": {
      "points": 6,
      "text": "If the CPU rule is written as <code>$_.CpuPct -gt 85</code> directly on the imported CSV objects (no conversion), which <b>extra</b> server appears in the report?",
      "options": [
        "SRV-WEB01 (72)",
        "SRV-DB02 (12)",
        "SRV-TST01 (9)",
        "None: PowerShell converts 85 and compares numerically"
      ]
    }
  }
];

const TOTAL_POINTS = Q.reduce((a, q) => a + q.points, 0);
const CP_POINTS = Q.reduce((a, q) => a + q.checkpoint.points, 0);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0');
const fmtClock = sec => { sec = Math.max(0, Math.ceil(sec)); return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`; };
const fmtDur = sec => { sec = Math.round(sec || 0); const m = Math.floor(sec / 60), s = sec % 60; return m ? `${m}m ${pad(s)}s` : `${s}s`; };

function stripComments(code) {
  return code.replace(/<#[\s\S]*?#>/g, '').replace(/(^|[^`'"\w])#[^\n]*/g, '$1');
}

/* PowerShell highlighter (display only) */
function highlight(src) {
  const re = /(@'[\s\S]*?'@|@"[\s\S]*?"@)|(<#[\s\S]*?#>|#[^\n]*)|('(?:[^']|'')*'|"(?:[^"`]|`[\s\S])*")|(\$(?:\{[^}]*\}|[\w:?]+|_))|(\[[A-Za-z][\w.]*(?:\[[\w.,\s]*\])?\](?:::\w+)?)|(\b[A-Z][a-z]+-[A-Z][A-Za-z]+\b)|((?:^|(?<=[\s(]))-[A-Za-z]+\b)|(\b(?:function|param|begin|process|end|if|elseif|else|foreach|for|while|do|try|catch|finally|return|switch|in|throw|break|continue)\b)|(\b\d+(?:\.\d+)?(?:GB|MB|KB|TB)?\b)/gm;
  let out = '', last = 0, m;
  while ((m = re.exec(src)) !== null) {
    if (m[0] === '') { re.lastIndex++; continue; }
    out += esc(src.slice(last, m.index));
    const cls = m[1] ? 't-str' : m[2] ? 't-com' : m[3] ? 't-str' : m[4] ? 't-var' : m[5] ? 't-type' : m[6] ? 't-cmd' : m[7] ? 't-op' : m[8] ? 't-kw' : 't-num';
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last));
}

function hasWork(q, a) {
  const code = (a && a.code) || '';
  const norm = s => s.replace(/\s+/g, '');
  return norm(code) !== norm(q.starter) && norm(stripComments(code)).length > 8;
}
function qState(q, a) {
  const code = hasWork(q, a), cp = a && a.choice !== null && a.choice !== undefined;
  return code && cp ? 'done' : code || cp ? 'partial' : 'empty';
}

/* ---------- Submission code ----------
   PSA1.<z|r>.<base64url payload>.<fnv1a checksum>
   z = deflate-raw compressed JSON, r = raw JSON. The checksum catches
   copy/paste damage; it is not a tamper-proof signature. */
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
function toB64url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function pipeBytes(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}
async function encodeSubmission(payload) {
  let bytes = new TextEncoder().encode(JSON.stringify(payload));
  let flag = 'r';
  if (typeof CompressionStream !== 'undefined') {
    try { bytes = await pipeBytes(bytes, new CompressionStream('deflate-raw')); flag = 'z'; } catch (e) { flag = 'r'; bytes = new TextEncoder().encode(JSON.stringify(payload)); }
  }
  const body = toB64url(bytes);
  return `PSA1.${flag}.${body}.${fnv1a(body)}`;
}
// Resolves the payload object, or throws Error with a readable message.
async function decodeSubmission(text) {
  const clean = String(text || '').replace(/[\s>]+/g, '');
  const m = clean.match(/PSA1\.([zr])\.([A-Za-z0-9_-]+)\.([0-9a-f]{8})/);
  if (!m) throw new Error('This is not a submission code. Codes start with "PSA1." and are shown on the candidate\'s results screen.');
  if (fnv1a(m[2]) !== m[3]) throw new Error('The code is damaged or incomplete. Ask the candidate to copy the whole code again.');
  let bytes = fromB64url(m[2]);
  if (m[1] === 'z') {
    if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot read compressed codes. Open the page in a current version of Chrome, Edge, Firefox or Safari.');
    bytes = await pipeBytes(bytes, new DecompressionStream('deflate-raw'));
  }
  const p = JSON.parse(new TextDecoder().decode(bytes));
  if (!p || p.v !== 1 || !p.answers || typeof p.answers !== 'object') throw new Error('The code was read but does not contain assessment answers.');
  // Normalise and bound untrusted input
  const answers = {};
  Q.forEach(q => {
    const a = p.answers[q.id] || {};
    const choice = Number.isInteger(a.choice) && a.choice >= 0 && a.choice < q.checkpoint.options.length ? a.choice : null;
    answers[q.id] = { code: String(a.code || '').slice(0, 20000), choice, flagged: !!a.flagged, spent: Math.max(0, Math.min(TOTAL_SECONDS * 2, Number(a.spent) || 0)) };
  });
  const num = v => (Number.isFinite(Number(v)) ? Number(v) : null);
  return {
    v: 1,
    attemptId: String(p.attemptId || fnv1a(m[2])).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40) || fnv1a(m[2]),
    candidate: String(p.candidate || '').slice(0, 80),
    startedAt: num(p.startedAt),
    submittedAt: num(p.submittedAt),
    autoSubmitted: !!p.autoSubmitted,
    answers
  };
}

window.PSA = {
  TOTAL_SECONDS, Q, TOTAL_POINTS, CP_POINTS,
  esc, pad, fmtClock, fmtDur, stripComments, highlight,
  hasWork, qState, encodeSubmission, decodeSubmission
};
})();
