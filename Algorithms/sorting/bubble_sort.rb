# https://medium.com/basecs/bubbling-up-with-bubble-sorts-3df5ac88e592

def bubble_sort(numbers)
  numbers_length = numbers.length

  (numbers_length - 1).times do |index|
    (1..numbers_length-1-index).each do |i|
      numbers[i-1], numbers[i] = numbers[i], numbers[i-1] if numbers[i-1] > numbers[i]
    end
  end

  numbers
end

# Total number of iterations = (n * (n-1))/2
# Time Complexity  = O(n^2)
# Space Complexity = O(n)

numbers = [9, 7, 4, 1, 2]
bubble_sort(numbers)
