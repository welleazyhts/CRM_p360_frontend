const fs = require('fs');

const filePath = 'c:\\Users\\rakshith bandi\\OneDrive\\Desktop\\CRM__py360\\src\\pages\\LeadDetails.jsx';
const content = fs.readFileSync(filePath, 'utf8');

const dispositionFields = `            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Disposition</InputLabel>
                <Select
                  value={callLogForm.disposition || ''}
                  label="Disposition"
                  onChange={(e) => setCallLogForm({ ...callLogForm, disposition: e.target.value })}
                >
                  <MenuItem value="Interested">✅ Interested</MenuItem>
                  <MenuItem value="Not Interested">❌ Not Interested</MenuItem>
                  <MenuItem value="Call Back">📞 Call Back</MenuItem>
                  <MenuItem value="Not Reachable">📵 Not Reachable</MenuItem>
                  <MenuItem value="Converted">🎉 Converted</MenuItem>
                  <MenuItem value="DNC">🚫 DNC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sub-Disposition"
                placeholder="e.g., Needs Quote, Specific Time"
                value={callLogForm.subDisposition || ''}
                onChange={(e) => setCallLogForm({ ...callLogForm, subDisposition: e.target.value })}
              />
            </Grid>
`;

const lines = content.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
    newLines.push(lines[i]);
    // Insert after line 2222 (index 2221)
    if (i === 2221) {
        newLines.push(dispositionFields);
    }
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('Disposition fields added successfully!');
