/**
 * This object converts strings from a charset to another
 * using as intermediate format UTF-8.
 */

/**
 * Supported encodings:
 * ASCII
 * UTF-8
 * ISO-8859-*
 */


function FormatException(message){
	this.message = message;
}

FormatException.prototype.toString = function(){
	return this.message;
};

var Iconv = {

	/**
	 * This is a useful table used to convert UTF to and from iso-8859-*
	 */
	iso8859table: {
		//     0xA0      0xA1      0xA2      0xA3      0xA4      0xA5      0xA6      0xA7      0xA8      0xA9      0xAA      0xAB      0xAC      0xAD      0xAE      0xAF      0xB0      0xB1      0xB2      0xB3      0xB4      0xB5      0xB6      0xB7      0xB8      0xB9      0xBA      0xBB      0xBC      0xBD      0xBE      0xBF      0xC0      0xC1      0xC2      0xC3      0xC4      0xC5      0xC6      0xC7      0xC8      0xC9      0xCA      0xCB      0xCC      0xCD      0xCE      0xCF      0xD0      0xD1      0xD2      0xD3      0xD4      0xD5      0xD6      0xD7      0xD8      0xD9      0xDA      0xDB      0xDC      0xDD      0xDE      0xDF      0xE0      0xE1      0xE2      0xE3      0xE4      0xE5      0xE6      0xE7      0xE8      0xE9      0xEA      0xEB      0xEC      0xED      0xEE      0xEF      0xF0      0xF1      0xF2      0xF3      0xF4      0xF5      0xF6      0xF7      0xF8      0xF9      0xFA      0xFB      0xFC      0xFD      0xFE      0xFF
		
		// ISO-8859-2
		2: [ '\u00A0', '\u0104', '\u02D8', '\u0141', '\u00A4', '\u013D', '\u015A', '\u00A7', '\u00A8', '\u0160', '\u015E', '\u0164', '\u0179', '\u00AD', '\u017D', '\u017B', '\u00B0', '\u0105', '\u02DB', '\u0142', '\u00B4', '\u013E', '\u015B', '\u02C7', '\u00B8', '\u0161', '\u015F', '\u0165', '\u017A', '\u02DD', '\u017E', '\u017C', '\u0154', '\u00C1', '\u00C2', '\u0102', '\u00C4', '\u0139', '\u0106', '\u00C7', '\u010C', '\u00C9', '\u0118', '\u00CB', '\u011A', '\u00CD', '\u00CE', '\u010E', '\u0110', '\u0143', '\u0147', '\u00D3', '\u00D4', '\u0150', '\u00D6', '\u00D7', '\u0158', '\u016E', '\u00DA', '\u0170', '\u00DC', '\u00DD', '\u0162', '\u00DF', '\u0155', '\u00E1', '\u00E2', '\u0103', '\u00E4', '\u013A', '\u0107', '\u00E7', '\u010D', '\u00E9', '\u0119', '\u00EB', '\u011B', '\u00ED', '\u00EE', '\u010F', '\u0111', '\u0144', '\u0148', '\u00F3', '\u00F4', '\u0151', '\u00F6', '\u00F7', '\u0159', '\u016F', '\u00FA', '\u0171', '\u00FC', '\u00FD', '\u0163', '\u02D9'],
		// ISO-8859-3
		3: [ '\u00A0', '\u0126', '\u02D8', '\u00A3', '\u00A4', '\u0000', '\u0124', '\u00A7', '\u00A8', '\u0130', '\u015E', '\u011E', '\u0134', '\u00AD', '\u0000', '\u017B', '\u00B0', '\u0127', '\u00B2', '\u00B3', '\u00B4', '\u00B5', '\u0125', '\u00B7', '\u00B8', '\u0131', '\u015F', '\u011F', '\u0135', '\u00BD', '\u0000', '\u017C', '\u00C0', '\u00C1', '\u00C2', '\u0000', '\u00C4', '\u010A', '\u0108', '\u00C7', '\u00C8', '\u00C9', '\u00CA', '\u00CB', '\u00CC', '\u00CD', '\u00CE', '\u00CF', '\u0000', '\u00D1', '\u00D2', '\u00D3', '\u00D4', '\u0120', '\u00D6', '\u00D7', '\u011C', '\u00D9', '\u00DA', '\u00DB', '\u00DC', '\u016C', '\u015C', '\u00DF', '\u00E0', '\u00E1', '\u00E2', '\u0000', '\u00E4', '\u010B', '\u0109', '\u00E7', '\u00E8', '\u00E9', '\u00EA', '\u00EB', '\u00EC', '\u00ED', '\u00EE', '\u00EF', '\u0000', '\u00F1', '\u00F2', '\u00F3', '\u00F4', '\u0121', '\u00F6', '\u00F7', '\u011D', '\u00F9', '\u00FA', '\u00FB', '\u00FC', '\u016D', '\u015D', '\u02D9'],
		// ISO-8859-4
		4: [ '\u00A0', '\u0104', '\u0138', '\u0156', '\u00A4', '\u0128', '\u013B', '\u00A7', '\u00A8', '\u0160', '\u0112', '\u0122', '\u0166', '\u00AD', '\u017D', '\u00AF', '\u00B0', '\u0105', '\u02DB', '\u0157', '\u00B4', '\u0129', '\u013C', '\u02C7', '\u00B8', '\u0161', '\u0113', '\u0123', '\u0167', '\u014A', '\u017E', '\u014B', '\u0100', '\u00C1', '\u00C2', '\u00C3', '\u00C4', '\u00C5', '\u00C6', '\u012E', '\u010C', '\u00C9', '\u0118', '\u00CB', '\u0116', '\u00CD', '\u00CE', '\u012A', '\u0110', '\u0145', '\u014C', '\u0136', '\u00D4', '\u00D5', '\u00D6', '\u00D7', '\u00D8', '\u0172', '\u00DA', '\u00DB', '\u00DC', '\u0168', '\u016A', '\u00DF', '\u0101', '\u00E1', '\u00E2', '\u00E3', '\u00E4', '\u00E5', '\u00E6', '\u012F', '\u010D', '\u00E9', '\u0119', '\u00EB', '\u0117', '\u00ED', '\u00EE', '\u012B', '\u0111', '\u0146', '\u014D', '\u0137', '\u00F4', '\u00F5', '\u00F6', '\u00F7', '\u00F8', '\u0173', '\u00FA', '\u00FB', '\u00FC', '\u0169', '\u016B', '\u02D9'],
		// ISO-8859-5
		5: [ '\u00A0', '\u0401', '\u0402', '\u0403', '\u0404', '\u0405', '\u0406', '\u0407', '\u0408', '\u0409', '\u040A', '\u040B', '\u040C', '\u00AD', '\u040E', '\u040F', '\u0410', '\u0411', '\u0412', '\u0413', '\u0414', '\u0415', '\u0416', '\u0417', '\u0418', '\u0419', '\u041A', '\u041B', '\u041C', '\u041D', '\u041E', '\u041F', '\u0420', '\u0421', '\u0422', '\u0423', '\u0424', '\u0425', '\u0426', '\u0427', '\u0428', '\u0429', '\u042A', '\u042B', '\u042C', '\u042D', '\u042E', '\u042F', '\u0430', '\u0431', '\u0432', '\u0433', '\u0434', '\u0435', '\u0436', '\u0437', '\u0438', '\u0439', '\u043A', '\u043B', '\u043C', '\u043D', '\u043E', '\u043F', '\u0440', '\u0441', '\u0442', '\u0443', '\u0444', '\u0445', '\u0446', '\u0447', '\u0448', '\u0449', '\u044A', '\u044B', '\u044C', '\u044D', '\u044E', '\u044F', '\u2116', '\u0451', '\u0452', '\u0453', '\u0454', '\u0455', '\u0456', '\u0457', '\u0458', '\u0459', '\u045A', '\u045B', '\u045C', '\u00A7', '\u045E', '\u045F'],
		// ISO-8859-6
		6: [ '\u00A0', '\u0000', '\u0000', '\u0000', '\u00A4', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u060C', '\u00AD', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u061B', '\u0000', '\u0000', '\u0000', '\u061F', '\u0000', '\u0621', '\u0622', '\u0623', '\u0624', '\u0625', '\u0626', '\u0627', '\u0628', '\u0629', '\u062A', '\u062B', '\u062C', '\u062D', '\u062E', '\u062F', '\u0630', '\u0631', '\u0632', '\u0633', '\u0634', '\u0635', '\u0636', '\u0637', '\u0638', '\u0639', '\u063A', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0640', '\u0641', '\u0642', '\u0643', '\u0644', '\u0645', '\u0646', '\u0647', '\u0648', '\u0649', '\u064A', '\u064B', '\u064C', '\u064D', '\u064E', '\u064F', '\u0650', '\u0651', '\u0652', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000'],
		// ISO-8859-7
		7: [ '\u00A0', '\u2018', '\u2019', '\u00A3', '\u20AC', '\u20AF', '\u00A6', '\u00A7', '\u00A8', '\u00A9', '\u037A', '\u00AB', '\u00AC', '\u00AD', '\u0000', '\u2015', '\u00B0', '\u00B1', '\u00B2', '\u00B3', '\u0384', '\u0385', '\u0386', '\u00B7', '\u0388', '\u0389', '\u038A', '\u00BB', '\u038C', '\u00BD', '\u038E', '\u038F', '\u0390', '\u0391', '\u0392', '\u0393', '\u0394', '\u0395', '\u0396', '\u0397', '\u0398', '\u0399', '\u039A', '\u039B', '\u039C', '\u039D', '\u039E', '\u039F', '\u03A0', '\u03A1', '\u0000', '\u03A3', '\u03A4', '\u03A5', '\u03A6', '\u03A7', '\u03A8', '\u03A9', '\u03AA', '\u03AB', '\u03AC', '\u03AD', '\u03AE', '\u03AF', '\u03B0', '\u03B1', '\u03B2', '\u03B3', '\u03B4', '\u03B5', '\u03B6', '\u03B7', '\u03B8', '\u03B9', '\u03BA', '\u03BB', '\u03BC', '\u03BD', '\u03BE', '\u03BF', '\u03C0', '\u03C1', '\u03C2', '\u03C3', '\u03C4', '\u03C5', '\u03C6', '\u03C7', '\u03C8', '\u03C9', '\u03CA', '\u03CB', '\u03CC', '\u03CD', '\u03CE', '\u0000'],
		// ISO-8859-8
		8: [ '\u00A0', '\u0000', '\u00A2', '\u00A3', '\u00A4', '\u00A5', '\u00A6', '\u00A7', '\u00A8', '\u00A9', '\u00D7', '\u00AB', '\u00AC', '\u00AD', '\u00AE', '\u00AF', '\u00B0', '\u00B1', '\u00B2', '\u00B3', '\u00B4', '\u00B5', '\u00B6', '\u00B7', '\u00B8', '\u00B9', '\u00F7', '\u00BB', '\u00BC', '\u00BD', '\u00BE', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u0000', '\u2017', '\u05D0', '\u05D1', '\u05D2', '\u05D3', '\u05D4', '\u05D5', '\u05D6', '\u05D7', '\u05D8', '\u05D9', '\u05DA', '\u05DB', '\u05DC', '\u05DD', '\u05DE', '\u05DF', '\u05E0', '\u05E1', '\u05E2', '\u05E3', '\u05E4', '\u05E5', '\u05E6', '\u05E7', '\u05E8', '\u05E9', '\u05EA', '\u0000', '\u0000', '\u200E', '\u200F', '\u0000'],
		// ISO-8859-9
		9: [ '\u00A0', '\u00A1', '\u00A2', '\u00A3', '\u00A4', '\u00A5', '\u00A6', '\u00A7', '\u00A8', '\u00A9', '\u00AA', '\u00AB', '\u00AC', '\u00AD', '\u00AE', '\u00AF', '\u00B0', '\u00B1', '\u00B2', '\u00B3', '\u00B4', '\u00B5', '\u00B6', '\u00B7', '\u00B8', '\u00B9', '\u00BA', '\u00BB', '\u00BC', '\u00BD', '\u00BE', '\u00BF', '\u00C0', '\u00C1', '\u00C2', '\u00C3', '\u00C4', '\u00C5', '\u00C6', '\u00C7', '\u00C8', '\u00C9', '\u00CA', '\u00CB', '\u00CC', '\u00CD', '\u00CE', '\u00CF', '\u011E', '\u00D1', '\u00D2', '\u00D3', '\u00D4', '\u00D5', '\u00D6', '\u00D7', '\u00D8', '\u00D9', '\u00DA', '\u00DB', '\u00DC', '\u0130', '\u015E', '\u00DF', '\u00E0', '\u00E1', '\u00E2', '\u00E3', '\u00E4', '\u00E5', '\u00E6', '\u00E7', '\u00E8', '\u00E9', '\u00EA', '\u00EB', '\u00EC', '\u00ED', '\u00EE', '\u00EF', '\u011F', '\u00F1', '\u00F2', '\u00F3', '\u00F4', '\u00F5', '\u00F6', '\u00F7', '\u00F8', '\u00F9', '\u00FA', '\u00FB', '\u00FC', '\u0131', '\u015F', '\u00FF'],
		// ISO-8859-10
		10:[ '\u00A0', '\u0104', '\u0112', '\u0122', '\u012A', '\u0128', '\u0136', '\u00A7', '\u013B', '\u0110', '\u0160', '\u0166', '\u017D', '\u00AD', '\u016A', '\u014A', '\u00B0', '\u0105', '\u0113', '\u0123', '\u012B', '\u0129', '\u0137', '\u00B7', '\u013C', '\u0111', '\u0161', '\u0167', '\u017E', '\u2015', '\u016B', '\u014B', '\u0100', '\u00C1', '\u00C2', '\u00C3', '\u00C4', '\u00C5', '\u00C6', '\u012E', '\u010C', '\u00C9', '\u0118', '\u00CB', '\u0116', '\u00CD', '\u00CE', '\u00CF', '\u00D0', '\u0145', '\u014C', '\u00D3', '\u00D4', '\u00D5', '\u00D6', '\u0168', '\u00D8', '\u0172', '\u00DA', '\u00DB', '\u00DC', '\u00DD', '\u00DE', '\u00DF', '\u0101', '\u00E1', '\u00E2', '\u00E3', '\u00E4', '\u00E5', '\u00E6', '\u012F', '\u010D', '\u00E9', '\u0119', '\u00EB', '\u0117', '\u00ED', '\u00EE', '\u00EF', '\u00F0', '\u0146', '\u014D', '\u00F3', '\u00F4', '\u00F5', '\u00F6', '\u0169', '\u00F8', '\u0173', '\u00FA', '\u00FB', '\u00FC', '\u00FD', '\u00FE', '\u0138']
				
	},

	fixedFromCharCode: function(codePt) {
		if (codePt > 0xFFFF) {
			codePt -= 0x10000;
			return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
		}
		else {
			return String.fromCharCode(codePt);
		}
	},

	/**
	 * Performs the conversion
	 */
	convert: function(input,output,from,to) {
		throw "Not implemented.";
	},
	
	encode: function(input,charset) {
		throw "Not implemented.";
	},

	/**
	 * Decodes a byte stream (an integer array) into a string using the specified charset
	 * @param input an array of numbers (they must be in the range 0-254)
	 * @param charset the charset
	 */
	decode: function(input,charset)
	{
		var ret = [];
		
		switch(charset.toLowerCase())
		{
		case 'utf-8':
		case 'utf8':
			// TODO: more robust checks & tests against invalid sequences
			for(var i = 0, cod; i < input.length; cod = 0){
				if(input[i] <= 0x7F){
					cod = input[i++];
				}
				else if(input[i] >= 0xC0 && input[i] <= 0xDF){
					cod += (input[i++] & 0x1F) << 6;
					cod += (input[i++] & 0x3F);
				} 
				else if(input[i] <= 0xEF){
					cod += (input[i++] & 0x0F) << 12;
					cod += (input[i++] & 0x3F) << 6;
					cod += (input[i++] & 0x3F);
				}
				else if(input[i] <= 0xF7){
					cod += (input[i++] & 0x07) << 18;
					cod += (input[i++] & 0x3F) << 12;
					cod += (input[i++] & 0x3F) << 6;
					cod += (input[i++] & 0x3F);
				}
				else {
					throw new FormatException("Invalid UTF-8 sequence at byte " + i);
				}
				ret.push(Iconv.fixedFromCharCode(cod));
			}
			break;
			
		case 'ascii':
			// Verify we are under 0x7F 
			for(var i = 0; i < input.length; i++){
				if(input[i] <= 0x7F){
					ret.push(String.fromCharCode(input[i]));
				}
				else {
					throw new FormatException("Invalid ASCII character ("+input[i]+") at " + i);
				}
			}
			break;
			
		default:
			charset = charset.toLowerCase();
			if(charset.indexOf('iso-8859-') == 0){
				var arr = /iso-8859-([0-9]{1,2})/.exec(charset);
				var iso_variant = parseInt(arr[1]);

                                if(iso_variant < 1 || iso_variant > 10){
                                    throw new Exception("Unsupported iso-8859 variant: " + iso_variant);
                                }

				for(var i = 0; i < input.length; i++){
					if( input[i] <= 0x7F || iso_variant == 1 ){
						ret.push(String.fromCharCode(input[i]));
					}
					else if(input[i] >= 0xA0) {
						ret.push(Iconv.iso8859table[iso_variant][input[i] - 0xA0]);
					}
					else {
						ret.push('\uFFFD');
					}
				}				
			}
			else{
				throw new Exception("Unknown charset "+charset);
			}
		}
		
		return ret.join('');
	}
};