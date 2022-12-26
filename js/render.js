import { alertModal } from "./main.js";
import {
  getItem,
  getDetailItem,
  authLogin,
  getAccounts,
  getQnA,
  postQna,
  deleteQna,
  purchaseItems,
  editItemStatus,
  searchItem,
  getAllPurchases,
  confirmPurchase,
  cancelPurchase,
} from "./requests.js";
import { loadEl } from "./store.js";
import kbank from "../img/kbank.png";
import hana from "../img/hana.png";
import kakao from "../img/kakao.png";
import nong from "../img/nong.png";
import shinhan from "../img/shinhan.png";
import woori from "../img/woori.png";
import kb from "../img/kb.png";
import slide1 from "../img/banner1.png";
import slide2 from "../img/banner2.png";
import slide3 from "../img/banner3.png";
import slide4 from "../img/banner4.png";
import slide5 from "../img/banner5.png";
import slide6 from "../img/banner6.png";
import noImgEl from "../img/no-search-data.png";

export const availableIndex = [];

const bankCode = {
  "089": 0,
  "081": 1,
  "090": 2,
  "011": 3,
  "088": 4,
  "020": 5,
  "004": 6,
};

const bankMatch = {
  0: "케이뱅크",
  1: "하나은행",
  2: "카카오뱅크",
  3: "NH농협은행",
  4: "신한은행",
  5: "우리은행",
  6: "KB국민은행",
};

const mainAppEl = document.querySelector(".app");

//tags 별로 분류
async function filterCategories(search = "") {
  const items = await getItem();
  const christmasItem = items.filter((item) => item.tags[0] === "크리스마스");
  const planteriorItem = items.filter((item) => item.tags[0] === "플랜테리어");
  const cookooItem = items.filter((item) => item.tags[0] === "쿠쿠");
  const drawerItem = items.filter((item) => item.tags[0] === "수납");
  const searchRes = await searchItem(search);
  return [christmasItem, planteriorItem, cookooItem, drawerItem, searchRes];
}

export async function renderMainPage() {
  mainAppEl.innerHTML = /* html */ `
    <article>
      <!-- 메인페이지 -->
      <section class="main-page">
        <div class="swiper mySwiper1">
          <ul class="swiper-wrapper">
            <a class="swiper-slide">
              <img src=${slide1} alt="신규회원 웰컴쿠폰 배너" />
            </a>
            <a class="swiper-slide" href="#/furniture/christmas">
              <img src=${slide2} alt="크리스마스 배너" />
            </a>
            <a class="swiper-slide" href="#/furniture/drawer">
              <img src=${slide3} alt="베스트 수납 배너" />
            </a>
            <a class="swiper-slide" href="#/furniture/drawer">
              <img src=${slide4} alt="인테리어 배너" />
            </a>
            <a class="swiper-slide" href="#/furniture/digital">
              <img src=${slide5} alt="쿠쿠 브랜드위크 배너" />
            </a>
            <a class="swiper-slide" href="#/furniture/plant">
              <img src=${slide6} alt="플랜테리어 배너" />
            </a>
          </ul>
          <div class="swiper-pagination"></div>
        </div>
        <div class="saleslist-wrap"></div>
      </section>
  `;
  const swiper = new Swiper(".mySwiper1", {
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: "true",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const filteredItems = await filterCategories();
  const tagsEl = [
    filteredItems[0],
    filteredItems[1],
    filteredItems[2],
    filteredItems[3],
  ];
  const itemTitlesArray = [
    "연말느낌 물씬, 크리스마스🎅",
    "초록을 담은 플랜테리어🌿",
    "쿠쿠하세요 쿠쿠🍚",
    "깔끔한 정리를 위해📦",
  ];
  const itemCommentArray = [
    "집에서 즐기는 홈파티",
    "지친 삶에 활기를 불어넣어요",
    "쿠쿠는 다 잘해요",
    "이것저것 다 넣어드립니다",
  ];
  const categoryArray = [
    "/#/furniture/christmas",
    "/#/furniture/plant",
    "/#/furniture/digital",
    "/#/furniture/drawer",
  ];
  const saleslistWrapper = mainAppEl.querySelector(".saleslist-wrap");
  saleslistWrapper.innerHTML = "";
  //반복문을 돌면서 tags 별로 아이템 넣어주기
  for (let i = 0; i < 4; i++) {
    const saleslistContainer = document.createElement("section");
    saleslistContainer.classList.add("saleslist-container");
    saleslistContainer.innerHTML = /* html */ `
			<div class="saleslist-header">
					<div class="saleslist-header-main">${itemTitlesArray[i]}</div>
					<div class="saleslist-seemore">
            <a href=${categoryArray[i]}><button style="font-weight:700;" >전체 보기</button></a>
					</div>
			</div>
			<div class="saleslist-comment">${itemCommentArray[i]}</div>
			<div class="saleslist-itemlist">
					<div class="itemlist">
`;
    const itemList = saleslistContainer.querySelector(".itemlist");
    for (let j = 0; j < 4; j++) {
      const itemListContainer = document.createElement("div");
      itemListContainer.classList.add("itemlist-container");
      itemListContainer.innerHTML = /* html */ `
      <a href="#/detail/${tagsEl[Math.floor(i)][j].id}">
				<div class="itemlist-image">
					<img
						src=${tagsEl[Math.floor(i)][j].thumbnail}
						alt=${tagsEl[Math.floor(i)][j].tags}이미지
					/>
				</div>
				<div class="itemlist-detail">
					<div class="itemlist-tag">${tagsEl[Math.floor(i)][j].tags}</div>
					<div class="itemlist-title">${tagsEl[Math.floor(i)][j].title}</div>
					<div class="itemlist-price">${tagsEl[Math.floor(i)][
            j
          ].price.toLocaleString()}원</div>
				</div>
        </a>
			</div>
			`;
      itemList.appendChild(itemListContainer);
    }
    saleslistWrapper.append(saleslistContainer);
  }
}

export function initCategoryPage() {
  mainAppEl.innerHTML = /* html */ `
  <!--카테고리 페이지-->
    <article class="category-page">
      <section class="category-container">
        <div class="category-header">
          <h3 class="category-title">&nbsp</h3>
          <select class="selector" name="sort">
            <option value="new" >최신순</option>
            <option value="low-price">낮은 가격 순</option>
            <option value="high-price">높은 가격 순</option>
          </select>
        </div>
        <div class="category-itemlist">
          <div class="itemlist"></div>
          <div class="no-result">
            <img src=${noImgEl} alt="검색결과없음" />
          </div>
        </div>
      </section>
    </article>
  `;
}

// 카테고리페이지 라우터 렌더링
export async function renderCategoryPage(category, search = "", sort = "new") {
  const noItemImg = document.querySelector(".no-result");
  noItemImg.style.display = "none";
  const categoryMap = { christmas: 0, plant: 1, digital: 2, drawer: 3, all: 4 };
  let filteredItems = await filterCategories(search);
  // 검색을 이용하면 전체 카테고리에서 검색.
  if (category !== "all") {
    document.querySelector(".category-title").textContent =
      filteredItems[categoryMap[category]][0].tags;
  } else {
    document.querySelector(".category-title").textContent = "전체";
  }

  // sort option 따라 순서 정해줘야함.
  let sortedItems = [...filteredItems[categoryMap[category]]];
  if (sort === "low-price") {
    sortedItems.sort((a, b) => a.price - b.price);
  } else if (sort === "high-price") {
    sortedItems.sort((a, b) => b.price - a.price);
  }

  const itemList = document.querySelector(".category-itemlist > .itemlist");
  itemList.innerHTML = "";
  // 검색결과 없을때 이미지 띄우기
  if (sortedItems.length === 0) {
    noItemImg.style.display = "flex";
    return;
  }
  for (let j = 0; j < sortedItems.length; j++) {
    const itemListContainer = document.createElement("div");
    itemListContainer.classList.add("itemlist-container");
    itemListContainer.innerHTML = /* html */ `
    <a href="#/detail/${sortedItems[j].id}">
      <div class="itemlist-image">
          <img
            src=${sortedItems[j].thumbnail}
            alt=${sortedItems[j].tags}이미지
          />
      </div>
      <div class="itemlist-detail">
        <div class="itemlist-tag">${sortedItems[j].tags}</div>
        <div class="itemlist-title">${sortedItems[j].title}</div>
        <div class="itemlist-price">${sortedItems[
          j
        ].price.toLocaleString()}원</div>
      </div>
      </a>
    </div>
    `;
    itemList.appendChild(itemListContainer);
  }
}

// 상세페이지 렌더링
export async function renderDetailPage(itemId) {
  loadEl.classList.remove("loader-hidden");
  mainAppEl.innerHTML = /* html */ `
    <!--상세 페이지-->
    <article class="detail-page">
      <section class="detail-container"></section>
    </article>
    <!--./상세페이지-->
  `;
  const detailItem = await getDetailItem(itemId);
  const detailContainer = document.querySelector(".detail-container");
  detailContainer.innerHTML = /* html */ `
    <div class="detail-view">
      <div class="thumnail">
        <img
          src=${detailItem.thumbnail}
          alt="${detailItem.title}상품 상세 사진"
        />
      </div>
      <div class="funiture-summary">
        <div class="furniture-tag">${detailItem.tags}</div>
        <div class="furniture-title">${detailItem.title}</div>
        <div class="furniture-price">${detailItem.price.toLocaleString()}원</div>
        <div class="item-addinfo">
          <div class="add-info-title">혜택</div>
          <div class="add-info-content">최대 ${
            Number(detailItem.price) * 0.01
          }P 적립 (회원 1% 적용)</div>
        </div>
        <div class="item-addinfo">
          <div class="add-info-title">배송비</div>
          <div class="add-info-content">3,500원 (100,000원 이상 구매하면 배송비 무료!)</div>
        </div>
        <div class="item-addinfo">
          <div class="add-info-title">교환/반품</div>
          <div class="add-del-info-content">
            배송/교환/반품 안내 자세히 보기
            <span class="material-symbols-outlined"> chevron_right </span>
          </div>
        </div>
        <div class="border-line"></div>
        <div class="buying-option">
          <p>옵션 선택</p>
          <select class="product-selector" type="button">
            <option value="default">기본</option>
            <option value="single-item">단품</option>
          </select>
        </div>
        <div class="buying-button">
          <div>
            <button type="button" class="option-cart">장바구니 담기</button>
          </div>
          <div>
            <button type="button" class="option-buynow">바로 구매</button>
          </div>
        </div>
      </div>
    </div>
    <div class="furniture-container">
      <div class="furniture-detail-view">
        <h2>제품 설명</h2>
      </div>
    </div>
    <div class="furniture-detail-img">
      <img
        src=${detailItem.photo}
        alt="${detailItem.title}제품 상세 사진"
      />
    </div>
    <div class="return-policy">
      <img
        src="https://image.ggumim.co.kr/proxy/20200916100508sKzPhMHtvd.jpeg/aHR0cDovL2ptczgxNS5jYWZlMjQuY29tL2ltZy9kZXRhaWwvY3VtYW1hX2FzLmpwZw"
        alt="반품 사진"
      />
    </div>
    <div class="qna-container">
      <div class="qna-title">
        <h2>Q & A 상품 문의</h2>
        <button class="qna-submit-request-btn" type="button">Q&A 작성하기</button>
      </div>
      <div class="qna-content">작성된 Q & A가 없습니다</div>
    </div>
`;

  // 제품 품절이면 품절띄워야함
  const buyBtn = document.querySelector(".buying-button");
  if (detailItem.isSoldOut) {
    buyBtn.innerHTML = /* html */ `
      <div>
        <button type="button" class="option-cart option-buynow" style="width:400px"; >상품이 품절되었습니다</button>
      </div>
  `;
    document.querySelector(".option-cart").style.filter = "grayscale(100%)";
    document.querySelector(".option-cart").style.pointerEvents = "none";
  }
  const qnaSubmitRequestBtn = document.querySelector(".qna-submit-request-btn");
  qnaSubmitRequestBtn.addEventListener("click", () => {
    location.href = "#/qna";
  });

  const optionBtn = document.querySelector(".option-cart");
  const optionBuynow = document.querySelector(".option-buynow");

  // 로그인안했을때 물건을 사려하면... 방어코드 추가.
  optionBtn.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alertModal(`로그인을 해주세요.`);
    }
  });
  optionBuynow.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alertModal(`로그인을 해주세요.`);
    } else location.href = `#/purchase/${detailItem.id}`;
  });

  // 배송/환불/교환 관련 사진으로 바로 보내줌
  const delInfoBtnEl = document.querySelector(".add-del-info-content");
  const shipElement = document.querySelector(".return-policy");
  delInfoBtnEl.addEventListener("click", () =>
    shipElement.scrollIntoView({
      behavior: "smooth",
    })
  );
  // 장바구니 담기 버튼 클릭
  const optionCart = document.querySelector(".option-cart");
  optionCart.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alertModal(`로그인을 해주세요.`);
      return;
    }
    const email = await authLogin();
    const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`)) || [];
    for (const cartIdEl of cartIdArr) {
      if (cartIdEl === detailItem.id) {
        alertModal(`이미 장바구니에 담긴 상품입니다.`);
        return;
      }
    }
    cartIdArr.push(detailItem.id);
    localStorage.setItem(`cartId-${email}`, JSON.stringify(cartIdArr));
    alertModal(`장바구니에 상품을 담았습니다.`);
  });
  loadEl.classList.add("loader-hidden");
}

// 구매 페이지 라우터 렌더링
export async function renderPurchasePage(items) {
  loadEl.classList.remove("loader-hidden");
  mainAppEl.innerHTML = /* html */ `
    <!--구매페이지-->
    <article class="purchase-page">
      <section class="purchase-container">
        <div class="purchase-inner"></div>
      </section>
    </article>
    <!--./구매 페이지-->
    `;
  // 결제 가능카드 불러오기
  const availableAccounts = await getAccounts();
  // 첫번째 카드 가능한지 아닌지 -> swiper에서는 onslide에서만 감지하므로..
  let availableFirst = "불가능";
  availableAccounts.forEach((account) => {
    if (account.bankName === "케이뱅크") availableFirst = "가능";
  });
  let detailItems = [];
  for (const item of items) {
    detailItems.push(getDetailItem(item));
  }
  detailItems = await Promise.all(detailItems);
  const purchaseContainer = document.querySelector(".purchase-inner");
  // 배송비는 총 가격이 10만이상이면 무료 아니면 3500원
  let shippingFee = 3500;
  let sumPrice = 0;
  detailItems.forEach((item) => {
    sumPrice += item.price;
  });
  if (sumPrice >= 100000) shippingFee = 0;
  const totalPrice = shippingFee + sumPrice;
  purchaseContainer.innerHTML = /* html */ `
          <div class="product">
            <div class="product-main">주문상품 ${detailItems.length}개</div>
            <div class="product-detail">
            </div>
          </div>
          <div class="address">
            <div class="address-title">배송지</div>
            <form>
              <div class="purchase-content">
                <div class="purchase-content-subject">우편번호</div>
                <div class="postal-code-1">
                <input type="text" id="sample6_postcode" class="postalcode" placeholder="우편번호">
                <input type="button" class = "postalcode-find-btn" value="우편번호 찾기">
                </div>
              </div>
              <div class="purchase-content">
              <div class="purchase-content-subject">주소지</div>
              <div class="postal-code-2 ">
              <input type="text" class = "address-input" id="sample6_address" placeholder="주소">
              <input type="text" class = "address-input" id="sample6_detailAddress" placeholder="상세주소">
              <input type="text" class = "address-input" id="sample6_extraAddress" placeholder="참고항목">
              </div>
            </div>
              <div class="purchase-content">
                <div class="purchase-content-subject">배송 메모</div>
                <select class="purchase-content-selector" type="button">
                  <option value="default">배송 메세지를 선택해주세요.</option>
                  <option value="purchase-item">
                    배송 전에 미리 연락 바랍니다.
                  </option>
                  <option value="purchase-item">
                    부재시 경비실에 맡겨 주세요.
                  </option>
                  <option value="purchase-item">
                    부재시 전화 주시거나 문자 남겨 주세요.
                  </option>
                </select>
              </div>
            </form>
          </div>
          <div class="buyer">
            <div class="buyer-title">주문자</div>
            <form>
              <div class="purchase-content">
                <div class="purchase-content-subject">주문자</div>
                <input
                  class="address-content-input"
                  placeholder="이름을 입력해주세요"
                />
              </div>
              <div class="purchase-content">
                <div class="purchase-content-subject">이메일</div>
                <input
                  class="address-content-input"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <div class="purchase-content">
                <div class="purchase-content-subject">휴대폰</div>
                <input
                  class="address-content-input"
                  placeholder="전화번호를 입력해주세요"
                />
              </div>
            </form>
          </div>
          <!-- </div> -->
          <div class="payment-amount">
            <div class="payment-amount-title">결제 금액</div>
            <div class="payment-amount-detail">
              <div class="payment-amount-content">
                <div class="payment-amount-content-subjcet">총 상품 금액</div>
                <div class="payment-amount-content-detail">${sumPrice.toLocaleString()}원</div>
              </div>
              <div class="payment-amount-content">
                <div class="payment-amount-content-subjcet">배송비</div>
                <div class="payment-amount-content-detail">${shippingFee.toLocaleString()}원</div>
              </div>
              <div class="payment-amount-content">
                <div class="payment-amount-content-subjcet" >총 결제 금액</div>
                <div class="payment-amount-content-detail" style="color:red">${totalPrice.toLocaleString()}원</div>
              </div>
            </div>
          </div>
          <div class="payment-method">
            <div class="payment-method-title">결제 수단</div>
            <span class = "payment-selected">선택된 계좌: 케이뱅크 (${availableFirst})</span>
          </div>
          <div class="payment-method-select-card">
            <div class="swiper account-swiper">
              <ul class="swiper-wrapper">
                <li class="swiper-slide">
                  <img src="${kbank}" width="210" height="140" alt="k뱅크" />
                  <p class="account-description">케이뱅크</p>
                </li>
                <li class="swiper-slide">
                  <img src="${hana}" width="210" height="140" alt="하나카드" />
                  <p class="account-description">하나은행</p>
                </li>
                <li class="swiper-slide">
                  <img
                    src="${kakao}"
                    width="210"
                    height="140"
                    alt="카뱅카드"
                  />
                  <p class="account-description">카카오뱅크</p>
                </li>
                <li class="swiper-slide">
                  <img src="${nong}" width="210" height="140" alt="농협카드" />
                  <p class="account-description">NH농협은행</p>
                </li>
                <li class="swiper-slide">
                  <img
                    src="${shinhan}"
                    width="210"
                    height="140"
                    alt="신한카드"
                  />
                  <p class="account-description">신한은행</p>
                </li>
                <li class="swiper-slide">
                  <img
                    src="${woori}"
                    width="210"
                    height="140"
                    alt="우리카드"
                  />
                  <p class="account-description">우리은행</p>
                </li>
                <li class="swiper-slide">
                  <img src="${kb}" width="210" height="140" alt="국민카드" />
                  <p class="account-description">KB국민은행</p>
                </li>
              </ul>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
            </div>
          </div>
          <div class= "payment-method account-select">
            <ul class="payment-method-cfm-msg">
              <li>
                - 최소 결제 가능 금액은 총 결제 금액에서 배송비를 제외한
                금액입니다.
              </li>
              <li>
                - 소액 결제의 경우 PG사 정책에 따라 결제 금액 제한이 있을 수
                있습니다.
              </li>
            </ul>
            <div class="payment-cfm"></div>
            <div class="payment-cfm-btn">
              <button>총 ${totalPrice.toLocaleString()}원 결제하기</button>
            </div>
          </div>
  `;
  const cartDetailItems = document.querySelector(".product-detail");
  for (const item of detailItems) {
    const productTag = document.createElement("div");
    productTag.classList.add("product-tag");
    const productContainer = document.createElement("div");
    productContainer.classList.add("product-container");
    productContainer.innerHTML = /* html */ `
      <img
        src=${item.thumbnail}
        width="100px"
        height="100px"
        alt="썸네일"
      />
      <div class="product-description">
        <div class="product-title">${item.title}</div>
        <div class="product-option">기본/1개</div>
        <div class="product-price">${item.price.toLocaleString()}원</div>
      </div>
    `;
    cartDetailItems.append(productTag, productContainer);
  }

  // 선택가능한계좌면 색깔입히고, 클릭가능하게. 불가능하면 그 반대로.
  const purchaseBtn = document.querySelector(".payment-cfm-btn button");
  if (availableFirst === "불가능") {
    purchaseBtn.style.filter = "grayscale(100%)";
    purchaseBtn.style.pointerEvents = "none";
  }

  //swiper를 여기에 선언해야 동작
  const accountSwiper = new Swiper(".account-swiper", {
    navigation: {
      nextEl: ".account-swiper .swiper-button-next",
      prevEl: ".account-swiper .swiper-button-prev",
    },
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: 30,
    on: {
      slideChange: function () {
        const currentPayment = document.querySelector(".payment-selected");
        const available = availableIndex.includes(this.realIndex)
          ? "가능"
          : "불가능";
        currentPayment.textContent = `선택된 계좌: ${
          bankMatch[this.realIndex]
        } (${available})`;
        if (available === "가능") {
          purchaseBtn.style.filter = "grayscale(0%)";
          purchaseBtn.style.pointerEvents = "auto";
        } else {
          purchaseBtn.style.filter = "grayscale(100%)";
          purchaseBtn.style.pointerEvents = "none";
        }
      },
    },
  });
  // 구매버튼 로직
  purchaseBtn.addEventListener("click", async () => {
    // 지금 현재 어떤 계좌에서 눌렀는지 확인해야함.
    // 또한 여러개 구매도 대응해야함.
    const currAccount = document.querySelector(
      ".account-swiper .swiper-slide-active"
    );
    const curBankName =
      bankMatch[currAccount.getAttribute("aria-label")[0] - 1];
    let bankId = "";
    let curAccountBal = 0;
    for (const account of availableAccounts) {
      if (account.bankName === curBankName) {
        bankId = account.id;
        curAccountBal = account.balance;
        break;
      }
    }
    // 여러개 구매를 위해 promise.all사용
    // promise.all이 잘 안먹는다... 왜 이럴까 ㅜㅜ....
    // 자 여기서. 구매를 할때 계좌잔액이 더 남아있는지 확인해야함.
    if (curAccountBal >= totalPrice) {
      for (const item of detailItems) {
        await purchaseItems(bankId, item.id);
        await editItemStatus(item.id, true);
      }
      if (location.hash === "#/purchase/cart") {
        const email = await authLogin();
        localStorage.removeItem(`cartId-${email}`);
      }
      localStorage.setItem("purchase", "true");
      alertModal(`거래가 정상적으로 이루어졌습니다.`);
    } else {
      localStorage.setItem("purchase", "false");
      alertModal("계좌에 잔액이 부족합니다.");
    }
  });

  // 결제 카드 렌더링하기.
  const paymentMethod = document.querySelector(".payment-method");
  const accountSelect = document.querySelector(".payment-method-select-card");
  const accountImgs = accountSelect.querySelectorAll("img");

  // 사용가능한 카드는 색깔을 입혀줌
  for (const account of availableAccounts) {
    accountImgs[bankCode[account.bankCode]].style.filter = "grayscale(0%)";
    availableIndex.push(bankCode[account.bankCode]);
  }
  paymentMethod.after(accountSelect);
  accountSelect.style.display = "block";

  //우편번호 찾기
  const postalCodeBtnEl = document.querySelector(".postalcode-find-btn");
  const postcodeEl = document.getElementById("sample6_postcode");
  const extraAddress = document.getElementById("sample6_extraAddress");
  const addressEl = document.getElementById("sample6_address");
  const detailAddressEl = document.getElementById("sample6_detailAddress");

  postalCodeBtnEl.addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: function (data) {
        var addr = ""; // 주소 변수
        var extraAddr = ""; // 참고항목 변수

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
          extraAddress.value = extraAddr;
        } else {
          extraAddress.value = "";
        }
        postcodeEl.value = data.zonecode;
        addressEl.value = addr;
        detailAddressEl.focus();
      },
    }).open();
  });

  loadEl.classList.add("loader-hidden");
}

export async function renderReceiptPage() {
  mainAppEl.innerHTML = /* html */ `
    <!-- 구매내역 페이지 -->
    <article class="receipt-page">
      <section class="receipt-container">
        <div class="receipt-inner"></div>
      </section>
    </article>
  `;

  const allPurchase = await getAllPurchases();
  const receiptContainer = document.querySelector(".receipt-inner");
  receiptContainer.innerHTML = /* html */ `
<div class="receipt">
  <div class="receipt-main">구매내역 ${allPurchase.length}개</div>
  <div class="receipt-detail">
  </div>
</div>
`;
  const receiptDetail = document.querySelector(".receipt-detail");
  for (let receipt of allPurchase) {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("receipt-container");
    itemContainer.innerHTML = /* html */ `
    <div class="left-container">
      <img src=${
        receipt.product.thumbnail
      } width="100px" height="100px" alt="썸네일">
      <div class="receipt-description">
        <div class="receipt-title">${receipt.product.title}</div>
        <div class="receipt-option">기본/1개</div>
        <div class="receipt-price">${receipt.product.price.toLocaleString()}원</div>
      </div>
    </div>
    <div class="btn-container">
    </div>
  `;

    if (receipt.done || receipt.isCanceled) {
      const doneBtn = document.createElement("button");
      doneBtn.classList.add("confirm-btn");
      doneBtn.textContent = "거래완료";
      doneBtn.style.filter = "grayscale(100%)";
      doneBtn.style.pointerEvents = "none";
      itemContainer.querySelector(".btn-container").append(doneBtn);
    } else {
      const confirmPurchaseBtn = document.createElement("button");
      confirmPurchaseBtn.classList.add("confirm-btn");
      confirmPurchaseBtn.textContent = "구매확정";
      const cancelPurchaseBtn = document.createElement("button");
      cancelPurchaseBtn.classList.add("cancel-btn");
      cancelPurchaseBtn.textContent = "구매취소";

      confirmPurchaseBtn.addEventListener("click", async () => {
        await confirmPurchase(receipt.detailId);
        localStorage.setItem("receipt", "true");
      });
      cancelPurchaseBtn.addEventListener("click", async () => {
        await cancelPurchase(receipt.detailId);
        await editItemStatus(receipt.product.productId, false);
        localStorage.setItem("receipt", "true");
      });

      itemContainer
        .querySelector(".btn-container")
        .append(confirmPurchaseBtn, cancelPurchaseBtn);
    }
    receiptDetail.appendChild(itemContainer);
  }
}

// 장바구니 페이지
let itemsPrice = 0;
export async function renderCartPages() {
  loadEl.classList.remove("loader-hidden");
  mainAppEl.innerHTML = /* html */ `
    <!-- 장바구니 -->
    <article class="cart-page">
      <section class="cart-inner">
        <h2>장바구니</h2>
        <div class="cart-container">
          <div class="cart-left">
            <ul class="cart-items">
              <p class="cart-empty">장바구니에 담긴 상품이 없습니다</p>
            </ul>
          </div>
          <div class="cart-right">
            <div class="item-price">
              <p>상품금액</p>
              <span class="single-price">0원</span>
            </div>
            <div class="item-price">
              <p>배송비</p>
              <span class="delivery-price">0원</span>
            </div>
            <div class="item-price">
              <p>결제예정금액</p>
              <span class="total-price">0원</span>
            </div>
            <button class="cart-order-btn">주문하기</button>
          </div>
        </div>
      </section>
    </article>
  `;
  // 장바구니 아이템들
  const cartEl = {
    cartItems: document.querySelector(".cart-items"),
    cartIcon: document.querySelector(".cart-icon"),
    singlePrice: document.querySelector(".single-price"),
    deliveryPrice: document.querySelector(".delivery-price"),
    totalPrice: document.querySelector(".total-price"),
    cartOrderBtn: document.querySelector(".cart-order-btn"),
  };

  cartEl.cartItems.innerHTML = "";

  const email = await authLogin();
  const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`)) || [];
  if (cartIdArr.length === 0) {
    emptyCart(cartEl);
    loadEl.classList.add("loader-hidden");
    return;
  }
  const promises = [];
  for (const id of cartIdArr) {
    promises.push(getDetailItem(id));
  }
  let promiseItems = await Promise.all(promises);
  itemsPrice = 0;
  for (const item of promiseItems) {
    const element = document.createElement("li");
    element.classList.add("cart-item");
    const attr = document.createAttribute("data-id");
    attr.value = item.id;
    element.setAttributeNode(attr);
    element.innerHTML = /* html */ `
      <img
        class="cart-img"
        src=${item.thumbnail}
        alt="cart-img"
      />
      <a href = "#/detail/${item.id}">
        <p class="cart-title">${item.title}</p>
      </a>
      <p class="cart-count">1</p>
      <p class="cart-price">${item.price.toLocaleString()}원</p>
      <img
        class="cart-delete"
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yMSA5Ljc2MiAyMC4yMzggOSAxNSAxNC4yMzggOS43NjIgOSA5IDkuNzYyIDE0LjIzOCAxNSA5IDIwLjIzOGwuNzYyLjc2MkwxNSAxNS43NjIgMjAuMjM4IDIxbC43NjItLjc2MkwxNS43NjIgMTV6IiBmaWxsPSIjQ0NDIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg=="
        alt="cart-delete"
      />
        `;
    itemsPrice += item.price;
    cartEl.cartItems.appendChild(element);
    const cartDelete = element.querySelector(".cart-delete");
    cartDelete.addEventListener("click", (event) => {
      deleteCartItems(event, cartEl);
    });
  }
  renderPrice(cartEl);
  loadEl.classList.add("loader-hidden");
}

function renderPrice(cartEl) {
  let deliveryFee = 3500;
  console.log(itemsPrice);
  console.log(cartEl);
  cartEl.singlePrice.textContent = `${itemsPrice.toLocaleString()}원`;
  if (itemsPrice >= 100000) {
    deliveryFee = 0;
    cartEl.deliveryPrice.textContent = `${deliveryFee}원`;
  } else cartEl.deliveryPrice.textContent = `${deliveryFee.toLocaleString()}원`;
  cartEl.totalPrice.textContent =
    (parseInt(itemsPrice) + parseInt(deliveryFee)).toLocaleString() + "원";
}

async function deleteCartItems(event, cartEl) {
  const incartItem = event.currentTarget.closest(".cart-item");
  const incartPrice = event.currentTarget.previousElementSibling.innerHTML;
  const num = /[^0-9]/g;
  itemsPrice = itemsPrice - incartPrice.replace(num, "");
  cartEl.cartItems.removeChild(incartItem);
  const email = await authLogin();
  const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`));
  const arr = cartIdArr.filter((cartIdEl) => {
    return incartItem.dataset.id !== cartIdEl;
  });
  if (arr.length === 0) {
    emptyCart(cartEl);
    localStorage.removeItem(`cartId-${email}`);
    return;
  }
  localStorage.setItem(`cartId-${email}`, JSON.stringify(arr));
  renderPrice(cartEl);
}

function emptyCart(cartEl) {
  cartEl.cartItems.innerHTML = /* html */ `
  <p class="cart-empty">장바구니에 담긴 상품이 없습니다</p>
  `;
  cartEl.singlePrice.textContent = "0원";
  cartEl.deliveryPrice.textContent = "0원";
  cartEl.totalPrice.textContent = "0원";
  cartEl.cartOrderBtn.style.filter = "grayscale(100%)";
  cartEl.cartOrderBtn.style.pointerEvents = "none";
}

export async function renderQnaPage() {
  mainAppEl.innerHTML = /* html */ `
    <!--QnA페이지-->
    <section class="qna-page">
      <div class="qna-container qna-container-page">
        <div class="qna-container-title">
          <div class="qna-title">무엇이든 물어보세요</div>
          <button type="button" class="qna-requset-button">질문 남기기</button>
        </div>
        <button class="clear-all-btn">모두 삭제</button>
        <div class="qna-table">
          <div class="qna-table-head">
            <div class="head-numbering">답변</div>
            <div class="head-subject">내용</div>
            <div class="head-date">작성일</div>
          </div>
          <div class="qna-table-content"></div>
        </div>
      </div>
      <!--QnA 입력 모달-->
      <div class="qna-back-ground">배경 필터</div>
      <div class="qna-modal">
        <h3>질문을 남겨주세요</h3>
        <p>확인하고 빠르게 답변을 남겨드릴게요</p>
        <article class="qna-box">
          <form id="qna-form">
            <div class="qna-select-list">
              <select class="selected-option">
                <option value="selected">선택해주세요</option>
                <option value="1">배송문의</option>
                <option value="2">상품문의</option>
                <option value="3">기타문의</option>
              </select>
            </div>
            <div class="qna-select-content">
              <textarea
                class="qna-content"
                placeholder="내용을 입력해 주세요 (최대 1,000자)"
                maxlength="1000"
              ></textarea>
            </div>
            <div class="qna-button-container">
              <button type="submit" class="qna-submit-btn">등록하기</button>
              <button type="button" class="qna-close-btn">취소하기</button>
            </div>
          </form>
        </article>
      </div>
    </section>
    <!--./QnA페이지-->
  `;
  //QnA 페이지
  const qnaTableContent = document.querySelector(".qna-table-content");
  const requsetBtnEl = document.querySelector(".qna-requset-button");
  const qnaSubmitBtnEl = document.querySelector(".qna-submit-btn");

  requsetBtnEl.addEventListener("click", qnaModalOpen);
  qnaSubmitBtnEl.addEventListener("click", addQna);

  const qnaItems = await getQnA();
  console.log(qnaItems);
  qnaTableContent.innerHTML = "";
  qnaItems.forEach((qnaItem) => {
    const createdTime = dayjs(qnaItem.createdAt).format("YYYY년 MM월 DD일");
    qnaTableContent.innerHTML += /* html */ `
    <ul class="qna-table-content-ul">
      <div class="qna-table-content-inner">
        <div class="content-numbering">대기중</div>
        <div class="content-subject">${qnaItem.title}</div>
        <div class="content-date">${createdTime}</div>
        <div class="content-id" style="display:none">${qnaItem.id}</div>
      </div>
    </ul>
  `;
  });
  const qnaTableContentUl = document.querySelectorAll(".qna-table-content-ul");
  const clearBtnEl = document.querySelector(".clear-all-btn");
  const contentIdEl = document.querySelectorAll(".content-id");

  clearBtnEl.addEventListener("click", deleteAll);

  async function deleteAll() {
    const qnaItems = document.querySelector(".qna-table-content");
    qnaTableContentUl.forEach(async (content) => {
      qnaItems.removeChild(content);
    });
    contentIdEl.forEach(async (id) => {
      await deleteQna(id.textContent);
    });
  }
}

async function addQna(event) {
  const selectOptionBtn = document.querySelector(".selected-option");
  const qnaInputEl = document.querySelector(".qna-content");
  const qnaModal = document.querySelector(".qna-modal");
  const backgroundFilter = document.querySelector(".back-ground");
  event.preventDefault();
  const qnaTitle = qnaInputEl.value.trim();
  if (selectOptionBtn.value === "selected" || qnaInputEl.value === "") {
    alertModal("내용을 모두 기입 해주세요");
    return;
  }
  const qnaItem = await postQna(qnaTitle);
  const { title, createdAt, id } = qnaItem;
  await renderQnaPage();
  qnaModal.style.visibility = "hidden";
  backgroundFilter.style.visibility = "hidden";
  qnaInputEl.value = "";
}

function qnaModalOpen() {
  const qnaModal = document.querySelector(".qna-modal");
  const backgroundFilter = document.querySelector(".back-ground");
  backgroundFilter.style.visibility = "visible";
  qnaModal.style.visibility = "visible";
  document.querySelector(".qna-close-btn").addEventListener("click", () => {
    backgroundFilter.style.visibility = "hidden";
    qnaModal.style.visibility = "hidden";
  });
}
