# https://medium.com/basecs/making-sense-of-merge-sort-part-1-49649a143478

def merge_sort(array)
  array_size = array.length

  return array if array_size <= 1

  mid_point = array_size / 2
  left_array = array[0...mid_point]
  right_array = array[mid_point..-1]

  left = merge_sort(left_array)
  right = merge_sort(right_array)

  merge(left, right)
end


def merge(left_array, right_array)
  array = []

  while !left_array.empty? && !right_array.empty?
    if right_array[0] < left_array[0]
      array << right_array.shift
    else
      array << left_array.shift
    end
  end

  array + left_array + right_array
end

# Number of times merge sort needs to run = n * log(n)
# Time Complexity = O(nlog(n))
# Space Complexity = O(n)
