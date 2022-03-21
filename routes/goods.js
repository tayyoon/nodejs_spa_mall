const express = require("express");
const Goods = require("../schemas/goods"); // 스키마에 굿즈.js에서 마지막에 넘겨준 모델을 참조하는것
const Cart = require("../schemas/cart");
const router = express.Router();

//장바구니 목록 조회 API
router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({goodsId: goodsIds});

  console.log(goods)

  res.json({
      cart: carts.map((cart) => ({
                  quantity: cart.quantity,
                  goods: goods.find((item) => item.goodsId === cart.goodsId)
      })),
         
          // return {     위와 동일한데 약식으로 작성한것, 괄호로 감싸줘서 괄호 안은 값이구나를 알려줘야함ㄴ
          //     quantity: cart.quantity,
          //     goods: goods.find((item) => item.goodsId === cart.goodsId)
          // };

  })

});

router.get("/", (req, res) => {
  res.send("this is root page");
});

// 목록 API
router.get("/goods", async (req, res) => {
  const { category } = req.query;

  const goods = await Goods.find({ category });
  res.json({
    goods   // json형식으로 응답을 해주는데, goods라는 카로 goods를 담아 전달해준다, => goods: goods (키와 변수가 같은이름일떄 goods 만 적어주면 객채초기자 기능으로 간단하게 작성 가능,약식으로 가능)
  })
});

//상세페이지 API
// get메서드로 goods라는 리소스(자원)에서 goodsId가 일치하는것을 찾아서 detail이라는 키에 그 데이터를 넣어서 응답을 주는 api
router.get("/goods/:goodsId", async (req, res) => {   // :뒤에 아무값이나 입력 받겠다, 받는 아무값을 goodsId라고 부르겠다 라는 느낌
  const { goodsId } = req.params;

  const [goods] = await Goods.find({ goodsId: Number(goodsId) })

  // const [detail]= goods.filter((item) => item.goodsId === Number(goodsId))    // distructuring, 구조화 [detail] => detail2, detail3추가하면 여러개를 가져올 수 있다. 1번째 2번째 3번째 개념인듯

  res.json({
    goods,
  })
});

// 장바구니 상품추가  API
router.post("/goods/:goodsId/cart", async (req, res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;

  const existCarts = await Cart.find({goodsId: Number(goodsId)});
  if (existCarts.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 장바구니에 들어있는 상품입니다."})
  }

  await Cart.create({goodsId: Number(goodsId), quantity});
  res.json({success: true});

});



//장바구니 상품제거 API
router.delete("/goods/:goodsId/cart", async (req, res) => {
  const {goodsId} = req.params;

  const existCarts = await Cart.find({goodsId: Number(goodsId)});
  if (existCarts.length) {
    await Cart.deleteOne({ goodsId: Number(goodsId)});
  }

  res.json({ success: true});

});

//상품 수량 수정  API
router.put("/goods/:goodsId/cart", async (req, res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;

  if (quantity < 1){
    res.status(400).json({
      errorMessage: "1 이상의 값을 입력해 주세요",
    })
     return;  // 이 조건이 맞으면 아래의 코드가 실행이 되지 않도록 하는 것
  }

  const existCarts = await Cart.find({goodsId: Number(goodsId)});
  if (!existCarts.length) {
    await Cart.create({goodsId: Number(goodsId), quantity});
  } else {
    await Cart.updateOne({ goodsId: Number(goodsId)}, {$set: {quantity}});
  }

  res.json({ success: true}); //응답을 안해주면 무! 한! 로! 딩! 

})

// post방식으로 /goods라는 주소로 요청을 받음, {}안의 데이터들을 body 로 받았을때, Goods데이터 베이스에서 동일한 goodsID가 있는지 찾아서 goods에 담고, 그것을 json방식으로 응답해서 보여주는 미들웨어
router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body; //goodsId = req.body.goodsId; 디스트럭쳐링, 여러가지를 변수로 지정하면 변수가 너무 많아지므로 한번에 선언

  const goods = await Goods.find({ goodsId });  //fidn()함수는 promise를 반환하므로 async함수를 사용해야 await 함수를 사용할 수 잇따!!!!
  if (goods.length) {
    return res
    .status(400)
    .json({ success: false, errorMessage: " 이미 있는 데이터 입니다. " });
  } //400 bad request, 너 요청 잘못했어 의미를 가지고 있다.

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});

module.exports = router;    // node의 약속 module.exports router를 모듈로서 내보내겠다
