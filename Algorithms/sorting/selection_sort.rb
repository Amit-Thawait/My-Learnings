# https://medium.com/basecs/exponentially-easy-selection-sort-d7a34292b049

def selection_sort(numbers)
  numbers_length = numbers.length

  (numbers_length - 1).times do |index|
    smallest_num_index = index

    ((index + 1)..numbers_length-1).each do |i|
      smallest_num_index = i if numbers[i] < numbers[smallest_num_index]
    end
    
    numbers[index], numbers[smallest_num_index] = numbers[smallest_num_index], numbers[index] if smallest_num_index != index
  end

  numbers
end

# Total number of iterations = (n-1) * (n-2)
# Time Complexity  = O(n^2)
# Space Complexity = O(1)

numbers = [33, 2, 52, 106, 73]
selection_sort(numbers)

numbers = [3, 2, 99, 2, 3, 5, 6]
selection_sort(numbers)
