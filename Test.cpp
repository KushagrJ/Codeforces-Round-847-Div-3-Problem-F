
// https://codeforces.com/contest/1790/submission/192769741

#include <iostream>
#include <vector>

int main()
{
    int n;
    std::cin >> n;
    std::cout << "const n = " << n << ";\n\n";

    std::vector<int> c(n);
    for (int i = 0; i < n; ++i)
        std::cin >> c[i];
    std::cout << "const c = [" << (c[0] - 1);
    for (int i = 1; i < n; ++i)
        std::cout << ", " << (c[i] - 1);
    std::cout << "];\n\n";

    std::vector<std::pair<int, int>> e(n - 1);
    for (int i = 0; i < (n - 1); ++i)
        std::cin >> e[i].first >> e[i].second;
    std::cout << "const graph = {\n    vertices: [\n";
    std::cout << "        {id: 0, color: \"white\", min_dist: n}";
    for (int i = 1; i < n; ++i)
        std::cout << ",\n        {id: " << i << ", color: \"white\", min_dist: n}";
    std::cout << "\n    ],\n    edges: [\n";
    std::cout << "        {source: " << (e[0].first - 1) << ", target: " << (e[0].second - 1) << "}";
    for (int i = 1; i < (n - 1); ++i)
        std::cout << ",\n        {source: " << (e[i].first - 1) << ", target: " << (e[i].second - 1) << "}";
    std::cout << "\n    ]\n};\n";

    return 0;
}
