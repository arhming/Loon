const shopeeUrl = {
    url: 'https://shopee.tw/mkt/coins/api/v2/checkin',
    method: "POST", // Optional, default GET.
    headers:{
        'Cookie': $prefs.valueForKey("CookieSP") + ';SPC_EC=' + $prefs.valueForKey("SPC_EC") + ';',
        'X-CSRFToken': $prefs.valueForKey("CSRFTokenSP"),
    }// Optional.
};

const shopeeluckydrawUrl = {
    url: 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/0244d69e637bbb73',
    headers: {
        'Cookie': $persistentStore.read("CookieSP") + ';SPC_EC=' + $persistentStore.read("SPC_EC") + ';',
        'X-CSRFToken': $persistentStore.read("CSRFTokenSP"),
    },
    body: {
        "request_id": (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
        "app_id": "E9VFyxwmtgjnCR8uhL",
        "activity_code": "010ac47631cf4bb5",
        "source": 0
    },
}

$httpClient.post(shopeeluckydrawUrl, function (error, response, data) {
    if (error) {
        $notification.post("蝦幣寶箱", "", "連線錯誤‼️")
        $done();
    }

    else {
        if (response.status == 200) {
            let obj = JSON.parse(data);
            if (obj["msg"] == 'no chance') {
                $notification.post("今日已領過蝦皮寶箱，每日只能領一次‼️", "", "");
                $done();
            }
            else if (obj["msg"] == 'success') {
                var packagename = obj["data"]["package_name"];
                $notification.post("恭喜獲得蝦幣寶箱：" + packagename, "", "");
                $done();
            }
            else if (obj["msg"] == 'expired') {
                $notification.post("活動已過期，請嘗試更新模組或腳本，或等待作者更新", "", "");
                $done();
            }
            $done();
        }
        else {
            $notification.post("蝦皮 Cookie 已過期‼️", "", "請重新登入 🔓");
            $done();
        }
    }
});

$task.fetch(shopeeUrl).then(response => {
    // response.statusCode, response.headers, response.body
    if (response.statusCode == 200) {
        let obj = JSON.parse(response.body);
        if (obj["data"]["success"]) {
            var user = obj["data"]["username"];
            var coins = obj["data"]["increase_coins"];
            var checkinday = obj["data"]["check_in_day"];
            $notify("蝦皮 " + user + " 已連續簽到 " + checkinday + " 天", "", "今日已領取 " + coins + "💰💰💰");
            $done();
        }
        $done();
    } else {
        $notify("蝦皮 Cookie 已過期‼️", "", "請重新登入 🔓");
        $done();
    }
}, reason => {
    // reason.error
    $notify("蝦皮簽到", "", "連線錯誤‼️")
    $done();
});
