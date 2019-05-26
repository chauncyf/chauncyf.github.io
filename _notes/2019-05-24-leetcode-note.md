---
author: Chauncy
category: code
---

# String

## 3. Longest Substring Without Repeating Characters
### Problem
```text
Given a string, find the length of the longest substring without repeating characters.

Example 1:
Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 

Example 2:
Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 
             Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
```
### Solution
Basic idea, use `sliding window` to slide through the whole string.   
Used a low pointer to log where current window starts, and use a map to log where each letters appeared fot the last time.  

**Caution**: when resetting the low pointer, we should take the max of `lo` and `dic[c] + 1`.  
E.g.`abcaab`, when the window slides to the last b, low pointer is at a with index of -2 and current window is `a`, but the former b with index of 1 is still in the hashmap. If we use `dic[c] + 1` at this point, the window will become `caab` instead of `ab`.
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        res = 0
        lo = 0
        dic = {}
        for i, c in enumerate(s):
            if c in dic:
                lo = max(lo, dic[c] + 1)  # caution: abcaab
            dic[c] = i
            res = max(i - lo + 1, res)
        return res
```


## 5. Longest Palindromic Substring
### Problem
```text
Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

Example 1:
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.

Example 2:
Input: "cbbd"
Output: "bb"
```
### Solution
Since a palindrome mirrors around its center, and there are totally `2n - 1` such centers, we could expand around these centers to find the longest palindrome. `Time complexity: O(n^2)`  

**Note**: use `//` in python for floor division.
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, end = 0, 0
        for i in range(len(s)):
            cur_len = max(self.expand(s, i, i), self.expand(s, i, i + 1))
            if cur_len > end - start:
                start = i - (cur_len - 1) // 2  # trick here, remember to -1 since it could expand at center of two char
                end = i + cur_len // 2
        return s[start:end + 1]

    def expand(self, s, left, right):
        l, r = left, right
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return r - l - 1
```
`TODO: DP, Manacher's Algorithm`


## 7. Reverse Integer
### Problem
```text
Given a 32-bit signed integer, reverse digits of an integer.

Example 1:
Input: 123
Output: 321

Example 2:
Input: -123
Output: -321

Example 3:
Input: 120
Output: 21

Note:
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.
```
### Solution
The most challenge part in this problem is not letting the result overflow, so the result has to be checked each time during calculation.
```java
class Solution {
    public int reverse(int x) {
        int result = 0;
        while (x != 0) {
            int tail = x % 10;
            x /= 10;
            if (result > Integer.MAX_VALUE / 10 || result == Integer.MAX_VALUE / 10 && tail > 7) return 0;
            if (result < Integer.MIN_VALUE / 10 || result == Integer.MIN_VALUE / 10 && tail < -8) return 0;
            result = result * 10 + tail;
        }
        return result;
    }
}
```
Another brilliant solution from discussion.  
I'm not sure if it's a good solution, because the integer could overflow during calculation (even though it is the intention).   
During calculation, the temp result is `result * 10 + tail`, but if it's smaller than `-2^31`or larger than `2^31 - 1`, it will overflow and return a number that is not correct.
```java
class Solution {
    public int reverse(int x) {
        int result = 0;
        while (x != 0) {
            int tail = x % 10;
            // overflow here, brilliant here
            if (((result * 10 + tail) - tail) / 10 != result) return 0;
            result = result * 10 + tail;
            x /= 10;
        }
        return result;
    }
}
```


## 9. Palindrome Number
### Problem
```text
Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.

Example 1:

Input: 121
Output: true
Example 2:

Input: -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
Example 3:

Input: 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
Follow up:

Coud you solve it without converting the integer to a string?
```
### Solution
My first thought, instead of convert it into string, it's to compare the first and last digit continuously.  
The problem is, how could I know I've compared half of the digits?  
Thanks to the official solution, they have a very similar approach by reverse the left half of the number, and when the right half is no longer larger than the right half, we know it is the end.
```java
class Solution {
    public boolean isPalindrome(int x) {
        // take care of edge cases        
        if (x < 0 || x % 10 == 0 && x != 0) return false;
        int left = x;
        int right = 0;
        // = only in case of x = 0
        while (left >= right) {
            right = right * 10 + left % 10;
            left /= 10;
            if (right == left || right / 10 == left) return true;
        }
        return false;
    }
}
```


## 20. Valid Parentheses
### Problem
```text
Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
    1. Open brackets must be closed by the same type of brackets.
    2. Open brackets must be closed in the correct order.
Note that an empty string is also considered valid.

Example 1:
Input: "()"
Output: true

Example 2:
Input: "()[]{}"
Output: true

Example 3:
Input: "(]"
Output: false

Example 4:
Input: "([)]"
Output: false

Example 5:
Input: "{[]}"
Output: true
```
### Solution
```java
public class Solution {
    public boolean isValid(String s) {
        Map<Character, Character> map = new HashMap<>();
        map.put('(', ')');
        map.put('{', '}');
        map.put('[', ']');
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            char cur = s.charAt(i);
            if (map.containsKey(cur)) {
                stack.push(cur);
            } else if (stack.isEmpty() || map.get(stack.pop()) != cur) { 
                return false;
            }
        }
        return stack.isEmpty();
    }
}
```


# Array

## 15. 3Sum
### Problem
```text
Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

Note:
The solution set must not contain duplicate triplets.

Example:
Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```
### Solution
A very classical problem.  
Basic idea is to sort the array and using `two pointer` to find the complementary two sum.  
```java
public class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; i++) {
            if (i == 0 || nums[i] != nums[i - 1]) {
                int lo = i + 1, hi = nums.length - 1;
                // dont need to check the length of input array, if its length < 3, lo < hi will not stand
                while (lo < hi) {
                    int sum = nums[i] + nums[lo] + nums[hi];
                    if (sum == 0) {
                        // hey!
                        res.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                        while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                        while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                        lo++;
                        hi--;
                    } else if (sum < 0) {
                        lo++;
                    } else {
                        hi--;
                    }
                }
            }
        }
        return res;
    }
}
```


## 215. Kth Largest Element in an Array
### Problem
```text
Find the kth largest element in an unsorted array. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Example 1:
Input: [3,2,1,5,6,4] and k = 2
Output: 5

Example 2:
Input: [3,2,3,1,2,4,5,5,6] and k = 4
Output: 4

Note: 
You may assume k is always valid, 1 ≤ k ≤ array's length.
```
### Solution
Naive approach, simply sort the array. Time complexity: `O(nlogn)`
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }
}
```
Priority queue approach, use a max-heap to keep the first k largest element. Time complexity: `O(nlogk)`
**Note**: min-heap comparator: `(n1, n2) -> n2 - n1` or `Collections.reverseOrder()` 
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>((n1, n2) -> n1 - n2);
        for (int i : nums) {
            heap.add(i);
            if (heap.size() > k) {
                heap.poll();
            }
        }
        return heap.poll();
    }
}
```
And...Python Hack!
```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k, nums)[-1]
```
`TODO: Quickselect`


# Tree

## 94. Binary Tree Inorder Traversal
### Problem
```text
Given a binary tree, return the inorder traversal of its nodes' values.

Example:

Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [1,3,2]

Follow up: Recursive solution is trivial, could you do it iteratively?
```
### Solution
First start with the recursive approach.
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        def trav(node, res):
            if node:
                trav(node.left, res)
                res.append(node.val)
                trav(node.right, res)
        res = []
        trav(root, res)
        return res
```
Since recursive solution is trivial :), let's do it iteratively!
```python
class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        stack, res = [], []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            res.append(cur.val)
            cur = cur.right
        return res
```


## 144. Binary Tree Preorder Traversal
### Problem
```text
Given a binary tree, return the preorder traversal of its nodes' values.

Example:

Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [1,2,3]

Follow up: Recursive solution is trivial, could you do it iteratively?
```
### Solution
Again, start with the trivial recursive approach.
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        def trav(node, res):
            if node:
                res.append(node.val)
                trav(node.left, res)
                trav(node.right, res)
        res = []
        trav(root, res)
        return res
```
Then the iterative approach.
```python
class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        stack, res = [root], []
        while stack:
            cur = stack.pop()
            if cur:
                res.append(cur.val)
                if cur.right:
                    stack.append(cur.right)
                if cur.left:
                    stack.append(cur.left)
        return res
```


## 145. Binary Tree Postorder Traversal
### Problem
```text
Given a binary tree, return the postorder traversal of its nodes' values.

Example:

Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [3,2,1]

Follow up: Recursive solution is trivial, could you do it iteratively?
```
### Solution
Finally comes the postorder, let's straightforwardly go to the iterative approach.
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        stack, res = [root], []
        while stack:
            cur = stack.pop()
            if cur:
                res.append(cur.val)            
                if cur.left:
                    stack.append(cur.left)
                if cur.right:
                    stack.append(cur.right)
        return res[::-1]  # wow, awesome :D
```


## 235. Lowest Common Ancestor of a Binary Search Tree
### Problem
```text
Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”

Given binary search tree:  root = [6,2,8,0,4,7,9,null,null,3,5]
```
![tree_image](https://assets.leetcode.com/uploads/2018/12/14/binarysearchtree_improved.png)
```
Example 1:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.

Example 2:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.
```
### Solution
Since it's a BST, the LCA is the split point of the two nodes, we could easily find it with this property.  
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root:
            return None
        cur = root
        while cur:
            if cur.val < p.val and cur.val < q.val:
                cur = cur.right
            elif cur.val > p.val and cur.val > q.val:
                cur = cur.left
            else:
                return cur
        return None
```


## 236. Lowest Common Ancestor of a Binary Tree
### Problem
```text
Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”

Given the following binary tree:  root = [3,5,1,6,2,0,8,null,null,7,4]
```
![tree_image](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)
```text
Example 1:
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.

Example 2:
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.
 
Note:
All of the nodes' values will be unique.
p and q are different and both values will exist in the binary tree.
```
### Solution
Without the property of BST, we cannot easily find the LCA by a split point.  
The idea here is to use a map to point each nodes to their parent nodes.   
1. Iterate down through the root node until p and q was found, then we have all the ancestor nodes of p & q.   
2. Add all ancestors of p into a set, and finally iterate up through ancestors of q.  
Once a ancestor of q was found in the set, it is the LCA.  

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        parent = {root: None}
        stack = [root]
        # use a stack to traversal the tree and store parent nodes of each nodes in the parent dict
        while stack and (p not in parent or q not in parent):
            cur = stack.pop()
            if cur.right:
                parent[cur.right] = cur
                stack.append(cur.right)
            if cur.left:
                parent[cur.left] = cur
                stack.append(cur.left)
        ancestor = set()
        # add all ancestors of p into the ancestor set
        while p:
            ancestor.add(p)
            p = parent[p]
        # iterate through ancestors of q
        while q:
            if q in ancestor:
                return q
            q = parent[q]
        return None
```
