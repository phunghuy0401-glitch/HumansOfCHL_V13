/* Nội dung 36 thư — trích nguyên văn từ tài liệu người dùng cung cấp.
   Chỉ loại bỏ dòng giờ/tên người gửi đứng ngoài nội dung thư ở mục 12 Tin. */
const HEART_DATA = {
  "10": [
    {
      "id": "10-anh-1",
      "name": "10 Anh 1",
      "specialty": "Tiếng Anh"
    },
    {
      "id": "10-anh-2",
      "name": "10 Anh 2",
      "specialty": "Tiếng Anh"
    },
    {
      "id": "10-địa",
      "name": "10 Địa",
      "specialty": "Địa lí"
    },
    {
      "id": "10-hóa",
      "name": "10 Hóa",
      "specialty": "Hóa học"
    },
    {
      "id": "10-lí",
      "name": "10 Lí",
      "specialty": "Vật lí"
    },
    {
      "id": "10-pháp",
      "name": "10 Pháp",
      "specialty": "Tiếng Pháp"
    },
    {
      "id": "10-sinh",
      "name": "10 Sinh",
      "specialty": "Sinh học"
    },
    {
      "id": "10-sử",
      "name": "10 Sử",
      "specialty": "Lịch sử"
    },
    {
      "id": "10-tin",
      "name": "10 Tin",
      "specialty": "Tin học"
    },
    {
      "id": "10-toán",
      "name": "10 Toán",
      "specialty": "Toán"
    },
    {
      "id": "10-trung",
      "name": "10 Trung",
      "specialty": "Tiếng Trung Quốc"
    },
    {
      "id": "10-văn",
      "name": "10 Văn",
      "specialty": "Ngữ văn"
    }
  ],
  "11": [
    {
      "id": "11-anh-1",
      "name": "11 Anh 1",
      "specialty": "Tiếng Anh"
    },
    {
      "id": "11-anh-2",
      "name": "11 Anh 2",
      "specialty": "Tiếng Anh"
    },
    {
      "id": "11-địa",
      "name": "11 Địa",
      "specialty": "Địa lí"
    },
    {
      "id": "11-hóa",
      "name": "11 Hóa",
      "specialty": "Hóa học"
    },
    {
      "id": "11-lí",
      "name": "11 Lí",
      "specialty": "Vật lí"
    },
    {
      "id": "11-pháp",
      "name": "11 Pháp",
      "specialty": "Tiếng Pháp"
    },
    {
      "id": "11-sinh",
      "name": "11 Sinh",
      "specialty": "Sinh học"
    },
    {
      "id": "11-sử",
      "name": "11 Sử",
      "specialty": "Lịch sử"
    },
    {
      "id": "11-tin",
      "name": "11 Tin",
      "specialty": "Tin học"
    },
    {
      "id": "11-toán",
      "name": "11 Toán",
      "specialty": "Toán"
    },
    {
      "id": "11-trung",
      "name": "11 Trung",
      "specialty": "Tiếng Trung Quốc"
    },
    {
      "id": "11-văn",
      "name": "11 Văn",
      "specialty": "Ngữ văn"
    }
  ],
  "12": [
    {
      "id": "12-anh-1",
      "name": "12 Anh 1",
      "specialty": "Tiếng Anh"
    },
    {
      "id": "12-anh-2",
      "name": "12 Anh 2",
      "specialty": "Tiếng Anh"
    },
    {
      "id": "12-địa",
      "name": "12 Địa",
      "specialty": "Địa lí"
    },
    {
      "id": "12-hóa",
      "name": "12 Hóa",
      "specialty": "Hóa học"
    },
    {
      "id": "12-lí",
      "name": "12 Lí",
      "specialty": "Vật lí"
    },
    {
      "id": "12-pháp",
      "name": "12 Pháp",
      "specialty": "Tiếng Pháp"
    },
    {
      "id": "12-sinh",
      "name": "12 Sinh",
      "specialty": "Sinh học"
    },
    {
      "id": "12-sử",
      "name": "12 Sử",
      "specialty": "Lịch sử"
    },
    {
      "id": "12-toán",
      "name": "12 Toán",
      "specialty": "Toán"
    },
    {
      "id": "12-trung",
      "name": "12 Trung",
      "specialty": "Tiếng Trung Quốc"
    },
    {
      "id": "12-văn",
      "name": "12 Văn",
      "specialty": "Ngữ văn"
    },
    {
      "id": "12-tin",
      "name": "12 Tin",
      "specialty": "Tin học"
    }
  ]
};

const LETTER_CONTENT = {
  "10-anh-1": "Happy Men’s Day to the boys of Anh 1 – Khối 10! Nhân ngày 19/11, chúc các bạn luôn tự tin, vui vẻ và giữ được nguồn năng lượng tích cực trong mọi hành trình.Điều đáng trân trọng hơn cả, mong rằng những ngày tháng tại Chuyên Hạ Long sẽ mang đến cho các bạn thật nhiều trải nghiệm đáng nhớ, những người bạn tuyệt vời và vô vàn lý do để mỉm cười mỗi ngày nhéee💘",
  "10-anh-2": "Nhân ngày 19/11, tập thể các công chúa 10 Anh 2 xin chúc phái nam của lớp luôn năng động, nhiệt huyết, học giỏi và ngày càng đẹp trai. Chúc các chàng trai có thật nhiều sức khoẻ, hạnh phúc và gặt hái được nhiều thành công",
  "10-địa": "Nhân ngày Quốc tế Nam giới 19/11, các bạn nữ lớp Địa xin gửi đến những chàng trai những lời chúc tốt đẹp nhất! \n\nChúc các cậu học tập tốt, luôn vui vẻ, tự tin, giữ mãi năng lượng tích cực của mình. Hy vọng tuổi trẻ của các cậu có thật nhiều trải nghiệm đáng nhớ và cơ hội để theo đuổi điều mình\n\nDù bản đồ cuộc đời có mở ra bao nhiêu vùng đất mới, mong các cậu vẫn luôn tìm được hướng đi mà mình theo đuổi.\n\nCảm ơn các cậu vì đã là điểm tựa vững chắc cho các bạn nữ. Chúc các chàng trai 10 ĐỊA 19/11 thật vui vẻ và luôn được yêu thương nhé! 💗",
  "10-hóa": "Gửi những chàng trai chuyên Hoá 10\n• Nhân ngày 19/11, chúc các bạn luôn giữ được ngọn lửa nhiệt huyết của tuổi trẻ, luôn vui vẻ, tự tin và không ngừng khám phá những điều mới mẻ nha. Mong rằng những năm tháng dưới mái trường Chuyên sẽ trở thành khoảng thời gian thật đẹp, nơi các bạn có thêm nhiều người bạn tốt và những kỷ niệm đáng nhớ nheee💞",
  "10-lí": "Chúc những chàng trai 10 Lý một ngày 19/11 thật đáng nhớ! Mong các bạn luôn giữ được sự năng động, tinh thần ham khám phá và niềm yêu thích tìm hiểu thế giới xung quanh. Và hơn thế, chúc các bạn có thật nhiều niềm vui, những người bạn tốt và một khởi đầu thật tuyệt vời tại mái trường Chuyên Hạ Long nhaaaaa💝",
  "10-pháp": "Gửi đến những chàng trai của 10 Pháp! 💙.                        Chúc các bạn nam luôn vui vẻ, tự tin, nhiệt huyết và giữ mãi tinh thần hết mình của tuổi trẻ. Mong rằng mỗi ngày đến lớp đều là một ngày vui, một ngày ngập tràn tiếng cười với các cậu. Mong rằng mỗi ngày đến lớp đều là một ngày thật đáng nhớ, luôn đạt được những điều mình mong muốn, học tập thật tốt và ngày càng trưởng thành hơn. Cảm ơn vì đã là một mảnh ghép rất riêng và không thể thiếu, góp phần tạo nên một tập thể 10 Pháp đầy màu sắc. Chúc các bạn luôn vững vàng, bản lĩnh, đôi khi có hơi báo nhưng lúc nào cũng đáng quý và tràn đầy năng lượng.                                              Mong rằng thanh xuân dưới mái trường Chuyên Hạ Long của chúng ta sẽ có thật nhiều tiếng cười, kỷ niệm đẹp và những khoảnh khắc chẳng thể nào quên. Chúc những chàng trai 10 Pháp luôn là phiên bản tuyệt vời nhất của chính mình! 💐",
  "10-sinh": "Gửi tới 9 Nhiễm Sắc Thể XY của lớp 10 sinh-những liên kết cộng hóa trị cực bền vững của tập thể lớp chúng ta. Bọn mình đã gắn bó với nhau được 3 tháng rồi đấy, khoảng thời gian tuy\nkhông quá dài nhưng lớp mình đã viết nên biết bao kỉ niệm đáng nhớ. Hôm nay, nhân ngày quốc tế nam giới 26 nhiễm sắc thể XX cute chúc 9 cá thể thuộc loài xâm lấn vào môi trường Chuyên Hạ Long luôn đạt độ thích nghi cao nhất với những bài tập, xung thần kinh dẫn truyền với tốc độ ánh sáng khi giải đề di truyền. Đặc biệt, luôn vui vẻ và hạnh phúc, sống hết mình với đam mê và đạt được thành công, mong ước của bản thân nhé!!!",
  "10-sử": "Gửi các chàng trai Sử 10! Chúc các bạn có một ngày 19/11 thật ý nghĩa, luôn vui vẻ và tràn đầy năng lượng. Những năm tháng đầu tiên ở Chuyên Hạ Long chắc hẳn sẽ có không ít điều mới mẻ, nhưng cũng sẽ là khoảng thời gian để các bạn gặp gỡ những người bạn tuyệt vời và tạo nên những kỷ niệm riêng. Mong rằng mỗi ngày đến trường đều mang đến cho các bạn một điều đáng nhớ nhée💕💕",
  "10-tin": "Gửi những chàng trai Tin 10! Nhân ngày 19/11, chúc các bạn luôn giữ được sự năng động, sáng tạo và niềm đam mê khám phá những điều mới mẻ. Mong rằng bên cạnh những giờ học và những dòng code, các bạn sẽ có thật nhiều tiếng cười, những người bạn đồng hành tuyệt vời và một thanh xuân thật đáng nhớ tại Chuyên Hạ Long. Chúc các bạn luôn tự tin và hết mình với những điều mình yêu thích nhéee💗♥️",
  "10-toán": "Chúc những chàng trai của tập thể lớp 10 Toán sẽ có một ngày 19/11 thật vui vẻ và trọn vẹn! Mong rằng các bạn sẽ luôn giữ được sự hồn nhiên, tinh thần ham học hỏi và nụ cười tươi sáng của những ngày đầu cấp ba.Đặc biệt chúc các bạn không chỉ tìm được lời giải cho những bài toán khó mà còn tìm thấy thật nhiều niềm vui trong hành trình trưởng thành của mình nhaaa 💘",
  "10-trung": "Gửi những chàng trai Trung 10! Nhân ngày 19/11, chúc các bạn có một ngày thật vui và nhiều tiếng cười. Mong rằng những ngày đầu tiên tại Chuyên Hạ Long sẽ mang đến cho các bạn thật nhiều điều thú vị, những người bạn tốt và những kỷ niệm đẹp. Chúc các bạn luôn tự tin, giữ được sự nhiệt huyết và tận hưởng thật trọn vẹn quãng thời gian thanh xuân dưới mái trường này nheee💗💗💗",
  "10-văn": "Gửi chàng trai duy nhất của 10 Văn! Nhân ngày đặc biệt này, chúc chàng trai luôn giữ trong mình một trái tim ấm áp, một tâm hồn phong phú và sự chân thành trong từng điều nhỏ bé. Hơn cả mong rằng bạn sẽ có thật nhiều câu chuyện đẹp để kể, thật nhiều kỷ niệm đáng nhớ để viết nên những trang thanh xuân thật rực rỡ dưới mái trường Chuyên Hạ Long nheee💓",
  "11-anh-1": "Chúc mừng ngày Quốc tế Nam giới 19/11💝💝 Cảm ơn các chàng trai 11 Anh 1 vì đã luôn ga lăng, tinh tế và là những mảnh ghép rực rỡ nhất của thanh xuân chúng ta. Chúc các cậu luôn giữ vững phong độ, học hết sức, chơi hết mình và sớm chinh phục được mọi mục tiêu phía trước nhé!\n\"To the boys of 11 English 1: Stay bold, stay brilliant, and never stop chasing your dreams.\"",
  "11-anh-2": "Chúc các chàng trai lớp 11 Anh 2 một ngày 19/11 thật hạnh phúc. Mong rằng các bạn sẽ không chỉ giỏi giang trong học tập mà còn luôn biết quan tâm, sẻ chia và trở thành điểm tựa tinh thần cho những người xung quanh. Chúc các bạn luôn được sống đúng với bản thân, được yêu thương và có thật nhiều niềm vui trong hành trình thanh xuân rực rỡ này nhé!!!💗💗🫶👌🤞💗",
  "11-địa": "GỬI NHỮNG CHÀNG TRAI K36 ĐỊA\n\n💌 Nếu thanh xuân là một bức tranh, có lẽ các cậu chính là những gam màu chẳng thể trộn lẫn. Đôi khi tinh nghịch, đôi khi vụng về, nhưng luôn mang đến những màu sắc thật riêng cho K36 Địa.\n\n🍃 Nhân ngày 19/11, chúc các cậu luôn giữ trong tim ngọn lửa nhiệt thành, trong đôi mắt ánh nhìn đầy hy vọng và trong bước chân lòng can đảm để chinh phục những chân trời rộng mở. Mong các cậu bình an đi qua những bốn mùa xuân thu, tự tin viết nên hành trình rực rỡ của riêng mình, để mỗi ngày tháng trôi qua đều là một mùa hoa đáng nhớ. Và dẫu mai này mỗi người một phương trời, mong chúng ta vẫn luôn mỉm cười khi nhớ về những năm tháng đã từng có nhau dưới mái nhà K36 Địa. \n\n🌍 Cảm ơn vì đã là những mảnh ghép của K36 Địaa",
  "11-hóa": "Gửi các chàng trai lớp 11 Hóa Chúc các bạn luôn vững vàng trước những thử thách, đủ kiên trì để theo đuổi điều mình yêu thích và đủ lạc quan để mỉm cười trước những ngày không như ý. Mong rằng mỗi ngày trôi qua đều là những khoảng thời gian ý nghĩa nhất trong thanh xuân của các bạn!!💗💗🫠😇🏳️‍🌈🙈🥚💗",
  "11-lí": "Gửi các chàng trai lớp 11 Lí ! Chúc các bạn luôn giữ được nguồn năng lượng tích cực, sự kiên trì và tinh thần không ngại thử thách. Cuộc sống đôi khi chẳng vận hành theo những quy luật mà chúng ta mong muốn, nhưng hy vọng các bạn vẫn luôn đủ lạc quan để đón nhận mọi điều và đủ mạnh mẽ để vượt qua tất cả!!💗💗🥰😜🥳💗💗",
  "11-pháp": "Chúc các chàng trai lớp 11 Pháp luôn giữ được khí chất lịch thiệp, sự chỉn chu và tinh tế rất riêng. Chặng đường THPT đang bước vào giai đoạn tăng tốc, chúc các bạn luôn bền bỉ với mục tiêu, dám nghĩ dám làm và không ngừng khẳng định bản thân để trở thành những phiên bản rực rỡ nhất.🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎",
  "11-sinh": "Gửi những chàng trai lớp 11 Sinh ! Chúc các bạn luôn giữ được trái tim ấm áp, tinh thần lạc quan và sự bền bỉ trên hành trình trưởng thành. Giống như mỗi mầm cây cần thời gian để lớn lên, mong rằng các bạn cũng sẽ luôn kiên nhẫn với bản thân, không ngừng phát triển và trở thành phiên bản tốt nhất của chính mình!!💗💗🙈🤩🤯🤯💗",
  "11-sử": "Nhân ngày 19/11, chúng tớ muốn gửi gắm tình cảm đến 7 bạn nam lớp 11 Sử.\nCảm ơn các cậu đã luôn nhiệt tình giúp đỡ, sẻ chia, nhường nhịn, và là chỗ dựa vững chắc cho chúng tớ trong suốt thời gian qua. \nChúng tớ xin chúc các bạn nam lớp mình luôn mạnh khỏe, tự tin, phát huy tối đa khả năng của bản thân trong cả học tập lẫn thể dục thể thao. Hãy luôn vui vẻ, tỏa sáng theo cách riêng của mình và cùng tập thể 11 Sử viết tiếp những trang thanh xuân thật rực rỡ dưới mái trường Chuyên Hạ Long nha 🫶🎉",
  "11-tin": "Chúc các nam sinh 11 Tin luôn giữ vững cái đầu lạnh và tư duy logic sắc bén. Mong rằng mọi bài toán khó, mọi dòng code phức tạp hay những áp lực học tập sắp tới đều sẽ được các bạn “giải mã” một cách mượt mà nhất. Hãy tiếp tục là những mảnh ghép thông minh, điềm tĩnh và là chỗ dựa công nghệ đáng tin cậy cho cả tập thể khối 11 🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎",
  "11-toán": "Chúc mừng ngày Quốc tế Nam giới 19/11! Chúc tập thể các bạn nam chuyên Toán luôn có một cuộc đời hội tụ đủ niềm vui, hạnh phúc và thành công; mọi biến số đều tìm được giá trị thích hợp, mọi bài toán đều có lời giải, mọi giới hạn đều được phá vỡ. Chúc các bạn luôn có xác suất thành công tiến tới 1, vận may đồng biến theo thời gian, nỗ lực không có điểm cực tiểu và tương lai luôn tiến tới + ♾️. Mong rằng dù cuộc đời có bao nhiêu phương trình khó, các bạn vẫn luôn tìm được nghiệm đẹp cho riêng mình.\n\nĐặc biệt, chúc các bạn nam K36 Toán mãi là những hằng số không thể thay thế trong tập thể!",
  "11-trung": "Chúc các bạn nam 11 Trung luôn giữ được tinh thần chí khí, sự tập trung và ý chí vươn lên mạnh mẽ. Ngoại ngữ là một hành trình dài đòi hỏi sự kiên trì, mong rằng các bạn sẽ luôn giữ vững phong độ, gặt hái thật nhiều điểm số ấn tượng và cùng lớp tạo nên một năm học khóa 11 thật đáng nhớ. Chỉ cần chăm chỉ, mọi nỗ lực sẽ được đền đáp “皇天不负有心人”.🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎",
  "11-văn": "Gửi chàng trai Văn 11! Nhân ngày 19/11, chúc bạn luôn vui vẻ, tự tin và giữ được sự chân thành, ấm áp của riêng mình. Mong rằng giữa những trang sách và câu chữ, bạn sẽ có thật nhiều câu chuyện đẹp để kể, những người bạn đáng quý để sẻ chia và những khoảnh khắc thật đáng nhớ. Chúc bạn luôn giữ được niềm yêu thích với những điều mình theo đuổi và viết nên một thanh xuân thật đẹp dưới mái trường Chuyên Hạ Long nhée💗💗",
  "12-anh-1": "Chúc các handsome boys lớp 12 Anh 1 luôn giữ trọn ngọn lửa nhiệt huyết, sự tự tin và tư duy rộng mở. Năm học cuối cùng dưới mái trường này là lúc để các bạn tỏa sáng và bứt phá giới hạn. Chúc các bạn làm chủ mọi kỳ thi quốc tế lẫn quốc gia, sẵn sàng vươn xa và để lại những kỷ niệm đẹp đẽ nhất cùng lớp.🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎",
  "12-anh-2": "Nhân ngày 19/11, chúc các chàng trai Anh 2 luôn giữ vững phong độ, tự tin và bản lĩnh trên mọi hành trình. Chúc các bạn không chỉ giỏi tiếng Anh mà còn giỏi chinh phục những mục tiêu của bản thân, luôn gặp nhiều may mắn, học tập thật tốt và có thật nhiều kỷ niệm đáng nhớ trong năm học cuối cấp nhee!! May your dreams come true and your future be filled with success and happiness!!🩷🩷🩷",
  "12-địa": "Chúc các chàng trai 12 Địa luôn vững vàng như núi, rộng mở như biển và không ngừng khám phá những chân trời mới! Mong rằng dù có đi đến bất cứ đâu, các bạn cũng luôn tìm thấy hướng đi phù hợp và chinh phục được những đỉnh cao của riêng mình. Chúc các bạn học tập thật tốt, gặp nhiều may mắn, luôn vui vẻ và có một năm cuối cấp trọn vẹn với thật nhiều kỷ niệm đẹp nhee!!🩷🩷🩷",
  "12-hóa": "Chúc những các bạn nam luôn vui vẻ, mạnh mẽ, trưởng thành hơn, luôn được yêu thương và gặp thật nhiều may mắn\nCảm ơn vì đã xuất hiện và trở thành một phần đáng nhớ của tuổi thanh xuân này.\nChúc các bạn một ngày 19/11 thật vui và thật đặc biệt!",
  "12-lí": "Chúc các chàng trai 12 Lí có một ngày 19/11 thật vui vẻ và ý nghĩa! Mong rằng các bạn luôn giữ được sự thông minh, nhanh nhạy và tinh thần ham học hỏi của mình. Chúc mọi bài toán khó đều tìm được lời giải, mọi thử thách đều có cách vượt qua và mọi dự định đều đạt được kết quả như mong muốn. Đặc biệt, chúc các bạn luôn giữ vững phong độ và bứt phá trong chặng đường cuối cấp nhee!!🩷🩷🩷",
  "12-pháp": "Chúc các chàng trai 12 Pháp có một ngày 19/11 thật vui vẻ và ngập tràn tiếng cười! Mong rằng các bạn luôn giữ được sự tự tin, phong thái lịch lãm và tinh thần lạc quan của mình. Chúc các bạn học tập thuận lợi, sớm chinh phục những mục tiêu đã đặt ra và luôn gặp được những điều tốt đẹp trên hành trình phía trước nhee!! Que votre avenir soit rempli de bonheur, de réussite et de belles surprises !🩷🩷🩷",
  "12-sinh": "Chúc các chàng trai 12 Sinh luôn khỏe mạnh, vui vẻ và tràn đầy sức sống! Mong rằng mỗi ngày trôi qua đều là một cơ hội để các bạn trưởng thành, phát triển và khám phá những điều mới mẻ. Chúc các bạn luôn giữ được sự nhiệt huyết, đạt được những thành tích đáng tự hào và có thật nhiều trải nghiệm đẹp trong những tháng ngày cuối cùng của thời học sinh nhee!!🩷🩷🩷",
  "12-sử": "Nhân ngày 19/11, chúc các chàng trai 12 Sử luôn vui vẻ, tự tin và giữ vững phong độ trong học tập cũng như cuộc sống. Mong rằng các bạn sẽ luôn giữ được sự nhiệt huyết, tinh thần trách nhiệm và bản lĩnh của mình trước mọi thử thách. Chúc các bạn có một năm học cuối cấp thật trọn vẹn, đạt được kết quả như mong đợi và lưu giữ thật nhiều kỷ niệm đẹp bên thầy cô, bạn bè. Hy vọng rằng chặng đường phía trước sẽ mở ra nhiều cơ hội mới và những trải nghiệm thú vị nhee!!🩷🩷🩷",
  "12-toán": "Chúc những bộ óc nhạy bén của 12 Toán luôn giữ vững sự tinh anh, tư duy mạch lạc và tinh thần kỷ luật cao độ. Giữa những công thức và bài toán hóc búa của năm lớp 12, chúc các bạn luôn tìm ra “nghiệm số” tối ưu nhất cho ước mơ của chính mình, cùng tập thể lớp tự tin bứt phá và cán đích trọn vẹn.🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎",
  "12-trung": "Đứng trước ngưỡng cửa quan trọng nhất của tuổi học trò, chúc các “帅哥“ 12 Trung luôn giữ được sự điềm tĩnh và bản lĩnh kiên cường. Mong các bạn sẽ vượt qua từng kỳ thi đánh giá, từng cột mốc HSK，CSCA hay kỳ thi Tốt nghiệp một cách xuất sắc nhất. Hãy luôn là chỗ dựa tinh thần vững chắc cho các “美女“ trong những ngày tháng cuối cấp này nhé!🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎",
  "12-văn": "Chúc chàng trai hiếm hoi nhưng vô cùng đặc biệt của 12 Văn luôn giữ được nét sâu sắc, ấm áp trong tâm hồn và sự vững vàng, trách nhiệm trong hành động. Càng về cuối chặng đường cấp 3, mong bạn càng thể hiện rõ bản lĩnh ngầm của mình – luôn kiên định trước áp lực và là lá chắn tinh thần đầy tin cậy cho tập thể.🩷❤️🧡💛💚🩵💙💜🖤🩶🤍🤎",
  "12-tin": "Chúc các chàng trai 12 Tin luôn giữ vững phong độ, tư duy sắc bén, code đâu trúng đó, bug nào cũng fix được. Chúc các bạn có một ngày 19/11 thật vui vẻ và tương lai luôn chạy mượt, không bao giờ gặp lỗi nhee🩷🩷🩷"
};

const MEDIA_ITEMS = [];
