const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(__dirname+'/app.html','utf8');const code=html.split('<script>')[1].split('let current=null;')[0];const c={};vm.createContext(c);vm.runInContext(code,c);const run=p=>JSON.parse(JSON.stringify(c.mapping(p)));
const p={cw:3,ch:2,ww:100,wh:100,ox:48,oy:49,base:0,order:'row'};
assert.deepEqual(run(p).map(r=>r[4]),[4948,4949,4950,5048,5049,5050]);
assert.deepEqual(run({...p,base:1}).map(r=>r[4]),[4949,4950,4951,5049,5050,5051]);
assert.deepEqual(run({...p,order:'column'}).map(r=>r[4]),[4849,4949,5049,4850,4950,5050]);
assert.deepEqual(run({...p,cw:1,ch:1,ox:99,oy:99}),[[0,0,99,99,9999]]);
for(const change of [{ox:99},{oy:-1},{cw:0},{cw:1.5},{ww:1001},{order:'bad'},{base:2}])assert.throws(()=>run({...p,...change}));
for(const order of ['row','column']){const all=run({cw:17,ch:11,ww:17,wh:11,ox:0,oy:0,base:0,order});assert.equal(new Set(all.map(r=>r[4])).size,187);assert.equal(Math.min(...all.map(r=>r[4])),0);assert.equal(Math.max(...all.map(r=>r[4])),186);}
assert.equal(c.csv(run({...p,cw:1,ch:1})), 'source_column,source_row,world_x,world_y,world_id\n0,0,48,49,4948\n');
console.log('18 assertions passed: explicit mappings, numbering origins/directions, bounds, uniqueness and CSV.');
