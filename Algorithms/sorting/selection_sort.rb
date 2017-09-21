# https://medium.com/basecs/exponentially-easy-selection-sort-d7a34292b049

def selection_sort(numbers)
  numbers_length = numbers.length

  numbers_length.times do |index|
    smallest_num_index = index

    ((index + 1)..numbers_length-1).each do |i|
      smallest_num_index = i if numbers[i] < numbers[index]
    end
    
    numbers[index], numbers[smallest_num_index] = numbers[smallest_num_index], numbers[index] if smallest_num_index != index
  end

  numbers
end

numbers = [33, 2, 52, 106, 73]
selection_sort(numbers)
