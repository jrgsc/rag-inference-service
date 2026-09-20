from app.ingest import chunk_text


def test_short_text_is_one_chunk():
    text = "just a short paragraph"
    assert chunk_text(text) == [text]


def test_splits_when_over_max_chars():
    para = "a" * 1000
    text = f"{para}\n\n{para}\n\n{para}"
    chunks = chunk_text(text, max_chars=1500, overlap=200)
    assert len(chunks) > 1
    assert all(len(c) <= 1500 + 200 for c in chunks)


def test_overlap_carries_tail_into_next_chunk():
    para = "b" * 1000
    text = f"{para}\n\n{'c' * 1000}"
    chunks = chunk_text(text, max_chars=1500, overlap=200)
    assert chunks[1].startswith(para[-200:])


def test_empty_text_gives_no_chunks():
    assert chunk_text("") == []
