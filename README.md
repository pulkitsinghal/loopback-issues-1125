```
cd ~/dev/
git clone https://github.com/pulkitsinghal/loopback-issues-1125.git loopback-issues-1125
cd loopback-issues-1125
npm install
DEBUG=boot:create-model-instances slc run
```

Look at the entries in db.json, there is no foreignKey in UserModel or GlobalConfigModel instances