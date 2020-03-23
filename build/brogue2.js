var __組到母=
{"幫":["幫","滂","並","明"]
,"端":["端","透","定","泥"]
,"知":["知","徹","澄","孃"]
,"精":["精","清","從","心","邪"]
,"莊":["莊","初","崇","生","俟"]
,"章":["章","昌","船","書","常"]
,"見":["見","溪","羣","疑"]
}

function __process_small_rhyme(str) {
	var res = str.match(/.{5}/gu);
	if (res.length != 3874)
		throw new Error('Invalid length of small rhymes');
	return res;
}

function __process_char_entities(str) {
	var r = /(\d+)([^\d])([^\d]+)/gu, d = {}, match;

	var 小韻數組 = new Array(3874);
	for (var i = 0; i < 3874; i++) {
		小韻數組[i] = new Array();
	}

	while ((match = r.exec(str)) !== null) {
		var 小韻號 = match[1] | 0, 字頭 = match[2], 解釋 = match[3];

		if (!d[字頭])
			d[字頭] = [[小韻號, 解釋]];
		else
			d[字頭].push([小韻號, 解釋]);

		小韻數組[小韻號 - 1].push([字頭, 解釋]);
	}

	return [d, 小韻數組];
}

var small_rhymes = __process_small_rhyme(小韻資料);
var char_entities_and_小韻數組 = __process_char_entities(字頭資料)
	, char_entities = char_entities_and_小韻數組[0]
	, 小韻數組 = char_entities_and_小韻數組[1];

/* 1. 由字頭查出對應的小韻號和解釋 */

function query漢字(漢字) {
	var res = char_entities[漢字];
	if (!res)
		return [];
	else
		return res.map(function (小韻號_解釋) {
			var 小韻號 = 小韻號_解釋[0], 解釋 = 小韻號_解釋[1];
			return {"小韻號": 小韻號, "解釋": 解釋};
		});
}

/* 2. 由小韻號查出對應的字頭和解釋 */

function query小韻號(小韻號) {
	return 小韻數組[小韻號 - 1];
}

/* 3. 查詢小韻號對應的音韻地位 */

function get母(小韻號) {
	return __母id到母[small_rhymes[小韻號 - 1][0]];
}

/* def make開合等重紐(開合, 等, 重紐):
	if 開合 == '開':
		if 等 == 1: return '0'
		if 等 == 2: return '1'
		if 等 == 3 and 重紐 == 'A': return '2'
		if 等 == 3 and 重紐 == 'B': return '3'
		if 等 == 3: return '4'
		if 等 == 4: return '5'
	if 開合 == '合':
		if 等 == 1: return '6'
		if 等 == 2: return '7'
		if 等 == 3 and 重紐 == 'A': return '8'
		if 等 == 3 and 重紐 == 'B': return '9'
		if 等 == 3: return 'a'
		if 等 == 4: return 'b' */

function get開合(小韻號) {
	var res = small_rhymes[小韻號 - 1][1];
	return ['0','1','2','3','4','5'].some(x => res == x) ? '開' : '合';
}

function get等(小韻號) {
	var res = small_rhymes[小韻號 - 1][1];
	return ['0','6'].some(x => res == x) ? '一'
		: ['1','7'].some(x => res == x) ? '二'
		: ['2','3','4','8','9','a'].some(x => res == x) ? '三' : '四';
}

function get重紐(小韻號) {
	var res = small_rhymes[小韻號 - 1][1];
	return ['2','8'].some(x => res == x) ? 'A'
		: ['3','9'].some(x => res == x) ? 'B' : null;
}

function get韻(小韻號) {
	// return small_rhymes[小韻號 - 1][2];  // JS: '莊O3𧤛'[3] = "\ud85e"
	return [...small_rhymes[小韻號 - 1]][2];
}

function get韻賅上去入(小韻號) {
	return __韻到韻賅上去入[get韻(小韻號)];
}

function get攝(小韻號) {
	return __韻賅上去入到攝[get韻賅上去入(小韻號)];
}

function get聲(小韻號) {
	if (小韻號 <= 0)
		throw new Error('Invalid 小韻號');
	if (小韻號 <= 1156)
		return '平';
	if (小韻號 <= 2091)
		return '上'
	if (小韻號 <= 3182)
		return '去';
	if (小韻號 <= 3874)
		return '入';
	throw new Error('Invalid 小韻號');
}

function get音韻描述(小韻號) {
	return get母(小韻號) + get開合(小韻號) + get等(小韻號) + (get重紐(小韻號) || '') + get韻賅上去入(小韻號) + get聲(小韻號);
}

function get上字(小韻號) {
	// return small_rhymes[小韻號 - 1][3];
	var res = [...small_rhymes[小韻號 - 1]][3];
	if (res == 'x')  // 沒有反切的小韻
		return null;
	else
		return res;
}

function get下字(小韻號) {
	// return small_rhymes[小韻號 - 1][4];
	var res = [...small_rhymes[小韻號 - 1]][4];
	if (res == 'x')  // 沒有反切的小韻
		return null;
	else
		return res;
}

function get反切(小韻號) {
	var 上字 = get上字(小韻號);
	if (!上字)
		return null;
	else
		return 上字 + get下字(小韻號) + '切';
}

/* 4. 判斷某個小韻是否屬於給定的音韻地位 */

function equal組(小韻號, s) {
	return __組到母[s].some(x => get母(小韻號) == x);
}

function equal聲(小韻號, s) {
	var 聲 = get聲(小韻號);
	if (['平', '上', '去', '入'].some(x => s == x))
		return s == 聲;
	if (s == '仄')
		return 聲 == '上' || 聲 == '去' || 聲 == '入';
	if (s == '舒')
		return 聲 == '平' || 聲 == '上' || 聲 == '去';
	throw new Error('Invalid 聲');
}

function equal音韻地位(小韻號, s) {
	if (小韻號 <= 0 || 小韻號 > 3874)
		throw new Error('無此小韻');
	return s.split(' 或 ').some(s => s.split(' ').every(function (s) {
		if (s.endsWith('母'))
			return s.slice(0, -1).split('').some(s => get母(小韻號) == s);
		else if (s.endsWith('韻'))
			return s.slice(0, -1).split('').some(s => get韻賅上去入(小韻號) == s);
		else if (s.endsWith('攝'))
			return s.slice(0, -1).split('').some(s => get攝(小韻號) == s);

		else if (s.endsWith('組'))
			return s.slice(0, -1).split('').some(s => equal組(小韻號, s));
		else if (s.endsWith('等'))
			return s.slice(0, -1).split('').some(s => get等(小韻號) == s);
		else if (s.endsWith('聲'))
			return s.slice(0, -1).split('').some(s => equal聲(小韻號, s));

		else if (s == '開口')
			return get開合(小韻號) == '開';
		else if (s == '合口')
			return get開合(小韻號) == '合';
		else if (s == '重紐A類')
			return get重紐(小韻號) == 'A';
		else if (s == '重紐B類')
			return get重紐(小韻號) == 'B';

		throw new Error('無此運算符');
	}));
}
