from app.rag.pipeline import RAGPipeline


def run_fact_test(
    rag: RAGPipeline,
    question: str,
    expected_keywords: list[str]
) -> bool:
    """
    Ask the RAG system a question and check whether
    the generated answer contains the expected factual concepts.
    """

    answer = rag.ask(question)

    answer_lower = answer.lower()

    missing_keywords = [
        keyword
        for keyword in expected_keywords
        if keyword.lower() not in answer_lower
    ]

    if missing_keywords:
        print(f"[FAIL] {question}")
        print(f"Answer: {answer}")
        print(f"Missing concepts: {missing_keywords}")
        return False

    print(f"[PASS] {question}")
    print(f"Answer: {answer}")

    return True


def run_unknown_test(
    rag: RAGPipeline,
    question: str,
    expected_response: str
) -> bool:
    """
    Test whether the RAG system refuses to answer when
    the required information is not present in the documents.
    """

    answer = rag.ask(question)

    if expected_response.lower() in answer.lower():
        print(f"[PASS] {question}")
        print(f"Answer: {answer}")
        return True

    print(f"[FAIL] {question}")
    print(f"Answer: {answer}")
    print(f"Expected response: {expected_response}")

    return False


def main():
    # Create the RAG pipeline once and reuse it
    # for all test cases.
    rag = RAGPipeline()

    passed = 0
    total = 0

    print("Tax RAG Evaluation")
    print("==================")

    # --------------------------------------------------
    # 1. Known-question tests
    # --------------------------------------------------

    fact_tests = [
        {
            "question": "What is GST?",
            "expected_keywords": [
                "indirect tax",
                "goods",
                "services"
            ]
        },
        {
            "question": "What is TDS?",
            "expected_keywords": [
                "tax deducted"
            ]
        },
        {
            "question": "Explain the GST composition scheme.",
            "expected_keywords": [
                "simplified",
                "GST",
                "eligible"
            ]
        },
        {
            "question": "What are the major sources of income?",
            "expected_keywords": [
                "salary",
                "house property",
                "business",
                "capital gains",
                "other sources"
            ]
        },
        {
            "question": "What is the difference between a financial year and an assessment year?",
            "expected_keywords": [
                "financial year",
                "income is earned",
                "assessment year",
                "assessed"
            ]
        },
        {
            "question": "What is advance tax?",
            "expected_keywords": [
                "tax",
                "financial year",
                "installments"
            ]
        },
        {
            "question": "What are CGST, SGST, UTGST, and IGST?",
            "expected_keywords": [
                "CGST",
                "SGST",
                "UTGST",
                "IGST"
            ]
        },
        {
            "question": "What is Input Tax Credit (ITC)?",
            "expected_keywords": [
                "input tax credit",
                "eligible",
                "GST",
                "business inputs"
            ]
        },
        {
            "question": "What is a GST tax invoice?",
            "expected_keywords": [
                "registered supplier",
                "taxable supplies",
                "invoice number",
                "GST rate"
            ]
        }
    ]

    for test in fact_tests:
        total += 1

        if run_fact_test(
            rag=rag,
            question=test["question"],
            expected_keywords=test["expected_keywords"]
        ):
            passed += 1

        print()

    # --------------------------------------------------
    # 2. Unknown-question / anti-hallucination test
    # --------------------------------------------------

    unknown_question = "What are the rules for property registration in India?"

    expected_unknown_response = (
        "I don't have enough information in the provided documents."
    )

    total += 1

    if run_unknown_test(
        rag=rag,
        question=unknown_question,
        expected_response=expected_unknown_response
    ):
        passed += 1

    print()

    # --------------------------------------------------
    # Final result
    # --------------------------------------------------

    print("==================")
    print(f"Result: {passed}/{total} tests passed")

    if passed == total:
        print("All tests passed.")
    else:
        print(f"{total - passed} test(s) failed.")


if __name__ == "__main__":
    main()