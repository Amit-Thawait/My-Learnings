KEYS = {
  'M' => 1000,
  'D' => 500,
  'C' => 100,
  'L' => 50,
  'X' => 10,
  'V' => 5,
  'I' => 1
}

def to_arabic(roman)
  nums = roman.chars.map { |x| KEYS[x] }
  nums.each_with_index.map do |num, i|
    next num if nums[i+1].nil?
    num < nums[i+1] ? num * -1 : num
  end.reduce(:+)
end
