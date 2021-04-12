# belinkServer
세종대학교 캡스톤
------------------------
```
1.  url 규칙은 api/를 시작으로 하며 그 다음 순서는 각 주요 데이터베이스 테이블 네임
    과 관련된 키워드 user, location, notice, prediction 등으로 시작한다.
2.  url/keyword/ 다음에 해당 기능들을 표시화는데, 최대한 명사형으로 적으며 작성방식은
    noun1-noun2-noun3 식으로 '-'하이픈 연결 방식으로 진행한다.
3.  작성 방식은
api
----user
    -controller.js
    -index.js
    형식으로 작성하며 controller 부분에는
    exports.camelName= (req,res,next)=>{}
    식으로 작성한다. 그리고 controller부분에는 카멜형식으로 네이밍한다.
    
    index부분에는 router를 생성하고 해당 controller에 맞는 url과 method를 선정하고 
    router.post('/get-user',controller.getUser)식으로 작성한다.
```

```
1.  자기 닉네임으로 branch로 두고 변경사항이 있을 때마다 branch에 push한다
2.  github에 들어가서 pullRequest를 한 다음에 변경사항을 자세히 적는다.
3.  예를 들어 api/user/get-user를 작성했다면 이러한 것을 작성했고, 안된다면 issues를 활용하여 어느 것이 안되는지
    알리도록 하자
```
