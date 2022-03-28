cmake_minimum_required(VERSION 3.21)

project("wasm_processor" CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


file(GLOB_RECURSE PROJECT_SRCS ${PROJECT_SOURCE_DIR}/src/*.cpp)

add_executable(${PROJECT_NAME} ${PROJECT_SRCS})
target_include_directories(${PROJECT_NAME} PUBLIC ${PROJECT_SOURCE_DIR}/include)

if (DEFINED EMSCRIPTEN)
    #set(CMAKE_EXECUTABLE_SUFFIX ".html")
    add_compile_definitions("__EMSCRIPTEN__")
    set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS
        " \
        -sMODULARIZE=1 \
        -sEXPORT_NAME='WASMProcessor' \
        --extern-post-js ${CMAKE_SOURCE_DIR}/dist/export-es6.js \
        -sWASM_ASYNC_COMPILATION=0 \
        -sSINGLE_FILE=1 \
        -sENVIRONMENT=shell \
        -lembind"
    )

    add_custom_command(
        TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy
                ${CMAKE_BINARY_DIR}/${PROJECT_NAME}.js
                ${PROJECT_SOURCE_DIR}/dist/${PROJECT_NAME}.js
        )
endif()