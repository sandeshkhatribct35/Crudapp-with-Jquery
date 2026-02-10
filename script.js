$(document).ready(function () {

  const $shoppingList = $(".shopping-list");
  const $shoppingForm = $(".shopping-form");
  const $filterButtons = $("[data-filter]");
  const $clearButtons = $("[data-clear]");
  const $notice = $(".shopping-notice");

  function generateId() {
    return Date.now().toString(36);
  }

  function saveItems() {
    const items = [];
    $shoppingList.find("li").each(function () {
      items.push({
        id: $(this).data("id"),
        name: $(this).find(".item-name").text(),
        completed: $(this).is("[data-completed]")
      });
    });
    localStorage.setItem("shoppingItems", JSON.stringify(items));
  }

  function loadItems() {
    const items = JSON.parse(localStorage.getItem("shoppingItems")) || [];
    $shoppingList.empty();
    items.forEach(item => $shoppingList.append(createItem(item)));
  }

  function createItem({ id, name, completed }) {
    const $li = $("<li>").attr("data-id", id);

    if (completed) {
      $li.attr("data-completed", "");
    }

    const $checkbox = $("<input type='checkbox'>")
      .prop("checked", completed)
      .on("change", function () {
        if (this.checked) {
          $li.attr("data-completed", "");
        } else {
          $li.removeAttr("data-completed");
        }
        saveItems();
      });

    const $name = $("<div>")
      .addClass("item-name")
      .text(name)
      .on("click", function () {
        if (!$li.is("[data-completed]")) {
          $(this).attr("contenteditable", true).focus();
        }
      })
      .on("blur", function () {
        $(this).removeAttr("contenteditable");
        saveItems();
      });

    const $drag = $("<span class='drag-icon'><i class='ri-equal-line'></i></span>");

    const $delete = $("<button class='delete-button'><i class='ri-delete-bin-line'></i></button>")
      .on("click", function () {
        $li.remove();
        updateNotice();
        saveItems();
      });

    $li.append($checkbox, $name, $drag, $delete);
    return $li;
  }

  $shoppingForm.on("submit", function (e) {
    e.preventDefault();
    const value = $("#item").val().trim();
    if (!value) return;

    $shoppingList.prepend(createItem({
      id: generateId(),
      name: value,
      completed: false
    }));

    this.reset();
    updateNotice();
    saveItems();
  });

  $filterButtons.on("click", function () {
    $filterButtons.removeClass("active");
    $(this).addClass("active");
    filterItems($(this).data("filter"));
  });

  function filterItems(type) {
    $shoppingList.find("li").each(function () {
      const completed = $(this).is("[data-completed]");
      $(this).toggle(
        type === "all" ||
        (type === "completed" && completed) ||
        (type === "incomplete" && !completed)
      );
    });
  }

  $clearButtons.on("click", function () {
    if ($(this).data("clear") === "all") {
      $shoppingList.empty();
    } else {
      $shoppingList.find("[data-completed]").remove();
    }
    updateNotice();
    saveItems();
  });

  function updateNotice() {
    $notice.toggleClass("show", $shoppingList.children().length === 0);
  }

  loadItems();
  updateNotice();

});
