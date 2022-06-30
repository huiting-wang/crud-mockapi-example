const express = require('express');
const cors = require('cors');

const app = express();

// 跨域配置
const corsOptions = {
  origin: [
    'http://localhost:9425',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const bodyParser = require('body-parser');
const userData = require('./mock/user');

app.use(cors(corsOptions));
app.use(express.static(__dirname));
app.use(bodyParser.json());

const portNum = process.env.PORT || 5500;
const apiUrl = '/user/info';

// 指定開啟頁面
app.get('/index.html', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// 取得全部資料
app.get(apiUrl, (req, res) => {
  res.send(userData);
});

// 取得單筆資料
app.get(`${apiUrl}/:id`, (req, res) => {
  const { id } = req.params;
  const arr = [];

  userData.forEach((obj, index) => {
    if (obj.id === id) {
      arr.push(userData[index]);
    }
  });

  res.send(arr);
});

// 新增資料
app.post(apiUrl, (req, res) => {
  const lastData = userData[userData.length - 1];
  const newID = Math.abs(lastData.id) + 1;
  const newData = {
    id: newID.toString(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    date: new Date().toISOString().slice(0, 10),
  };

  userData.push.apply(userData, [newData]);

  res.send(newData);
});

// 修改單筆資料
app.put(`${apiUrl}/:id`, (req, res) => {
  const { id } = req.params;
  const newName = req.body.name;
  const newEmail = req.body.email;
  const newPhone = req.body.phone;
  const updateData = {
    id: id.toString(),
    name: newName,
    email: newEmail,
    phone: newPhone,
    date: new Date().toISOString().slice(0, 10),
  };

  userData.forEach((obj, i) => {
    if (obj.id === id) {
      obj.name = newName;
      obj.email = newEmail;
      obj.phone = newPhone;
    }
  });

  res.send(updateData);
});

// 刪除單筆資料
app.delete(`${apiUrl}/:id`, (req, res) => {
  const { id } = req.params;

  userData.forEach((obj, i) => {
    if (obj.id === id) {
      userData.splice(i, 1);
    }
  });

  res.send({
    id,
    data: userData,
  });
});

app.listen(portNum, () => {
  console.log('Example app listening on port 5500!');
});
