import re


def list_concatenate(arg):
    """
    Join a list of Unicode characters or other types into a single string.

    This function is designed to handle joining a list of Unicode characters into
    a single string, with commas separating each element. This is particularly useful
    when working with libraries like XlsxWriter that do not support writing lists
    directly into a cell.

    Parameters:
    arg (list): A list of Unicode characters or other types to be concatenated.

    Returns:
    str: A single string containing the concatenated elements separated by commas.
    """
    try:
        result = arg[0].decode("utf-8")
        for i in range(1, len(arg)):
            result = result + ", " + arg[i].decode("utf-8")
    except:
        result = ", ".join([str(i) for i in arg])
    return result


def cleanhtml(raw_html):
    """
    Remove HTML tags from a string
    """
    if type(raw_html) is str:
        cleanr = re.compile("<.*?>")
        cleantext = re.sub(cleanr, "", raw_html)
    else:
        if type(raw_html) is list:
            cleantext = list_concatenate(raw_html)
        else:
            cleantext = raw_html
    return cleantext


def clean_row_value(raw_value):
    """
    Clean HTML tags and decode string to UTF-8 if possible.

    Parameters:
    raw_value (str): The raw HTML content to be cleaned.

    Returns:
    str: The cleaned and UTF-8 decoded string.
    """

    cleaned_value = cleanhtml(raw_html=raw_value)
    try:
        cleaned_value = cleaned_value.decode("utf-8")
    except:
        pass  # Ignore decoding errors
    return cleaned_value
