python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger')"
gunicorn app:app --timeout 120 --workers 1 --threads 2 --bind 0.0.0.0:$PORT