cmake_minimum_required(VERSION 3.10)
project(InfraPulseAIEngine)

set(CMAKE_CXX_STANDARD 17)

# Find pybind11 (assume installed via pip and accessible)
find_package(pybind11 REQUIRED)

pybind11_add_module(stt_engine bindings/stt_binding.cpp)
pybind11_add_module(nlp_engine bindings/nlp_binding.cpp)
