const express = require("express"); // express 파일을 불러온다. require로, express라는 변수에 넣겠다!
const connect = require("./schemas");    //index라는 파일의 이름은 생략이 가능해서 아무것도 추가된것이 없다면 일단 폴더안에 index가 있는지 보고 있으면 실행한다
const app = express(); //express의 서버 객체를 받아와 app 변수에 담았다 -> 이렇게 사용하라고 정해져있뜸..
const port = 3000;  

connect();  //스키마에서 불러온 connect함수를 실행함!!

const goodsRouter = require("./routes/goods");


const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, "-", new Date());
    next();
};


// app.use((req, res, next) => {   //미들웨어를 사용할수 있게 작성하는것 (순서에 따라 실행되기 때문에 위치가 중요하다.)
//     // console.log("미들웨어가 구현됐나????");
//     // next(); // 다음 미들웨어러 넘어기게 하는 다리 같은것, next 가 없으면 app.get이 돌아가지 않아 무한로딩 된다.
//     // res.send("미들웨어의 응답입니다");
//     // console.log("주소는?", req.path);
//     if (req.path === "/test") {
//         res.send("테스트 주소로 왔구나!");
//     }else {
//         next();
//     }
// });  

app.use(express.json());    // body로 들어오는 json형태의 정보를 파싱 해주는 함수
app.use(requestMiddleware);

app.use("/api", [goodsRouter])

app.get('/', (req, res) => {
    res.send("Hello World")
});

app.listen(port, () => {    // 서버를 port변수의 포트로 켜겠다.
    console.log(port, "포트로 서버가 켜졌어요!");
});


