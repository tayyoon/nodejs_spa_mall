const mongoose = require("mongoose");

const connect = () => {
    mongoose
    .connect("mongodb://localhost:27017/spa_mall", {ignoreUndefined: true}).catch((err) => { //27017: mongo의 기본 포트!!!! spa_mall: 데이터 베이스에 까지 연결
        console.error(err)  //.catch(err) 에러를 캐치구문으로 잡는데 그것 에러를 err로 넘겨 console.error() 로 출력한다
        });   
    };

    module.exports = connect;    // 외부에서 사용할 수 있도록 하기 위해서 (몽고와 관련된 대부분의 코드는 스키마 안에 들어가기 때문에 외부에서 사용할 수 있도록 하기 위함)